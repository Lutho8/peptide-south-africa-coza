import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '@/components/auth/AuthModal';
import { captureLead } from '@/lib/crm';
import { trackBwEvent } from '@/lib/bloodwork/analytics';

import { ScanFormState } from '@/components/bloodwork/ScanForm';
import { BloodworkResults, BloodworkScanResult } from '@/components/bloodwork/BloodworkResults';
import { PremiumGate } from '@/components/bloodwork/PremiumGate';
import { BloodworkWizard } from '@/components/bloodwork/BloodworkWizard';
import { useScanProgress } from '@/hooks/useScanProgress';
import { exportBloodworkProtocolPDF } from '@/utils/bloodworkProtocolPdf';

const DISCLAIMER =
  'This analysis is for educational and informational purposes only. It does not constitute medical advice. Consult a qualified healthcare provider before making any changes to your health regimen, including peptide protocols, supplements, or diagnostic testing.';

const INITIAL_STATE: ScanFormState = {
  file: null,
  age: '',
  sex: 'na',
  goals: [],
  peptideHistoryUsed: null,
  peptideHistoryNotes: '',
};

function mapScanError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e ?? '');
  if (/abort/i.test(msg)) return '';
  if (/429|rate/i.test(msg)) return 'Too many scans right now. Wait 30 seconds and try again.';
  if (/402|credit/i.test(msg)) return 'Premium scan credits exhausted for this hour. Try again shortly.';
  if (/parse|empty|json/i.test(msg))
    return "We couldn't read this lab report. Try a clearer scan or a different file format (PDF, JPG, PNG).";
  if (/upload|storage|network|fetch/i.test(msg))
    return 'Something went wrong on our side. Try again — your file is still saved.';
  return msg || 'Unexpected error during scan.';
}

export default function BloodworkPage() {
  const { user } = useAuth();
  const { hasPremium, isLoading: membershipLoading } = useMembership();
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState<ScanFormState>(INITIAL_STATE);
  const [running, setRunning] = useState<'baseline' | 'deep' | null>(null);
  const [result, setResult] = useState<BloodworkScanResult | null>(null);
  const [labReportId, setLabReportId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stackActivated, setStackActivated] = useState(false);
  const lastTierRef = useRef<'baseline' | 'deep' | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const progress = useScanProgress();

  // Post-purchase return handler — fires when user comes back from the shop.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stack_activated') === '1') {
      setStackActivated(true);
      trackBwEvent('bw_protocol_activated', { source: 'shop_return' });
      toast.success('Stack purchased — activate your protocol below.');
      // Clean URL so refresh doesn't retrigger
      const url = new URL(window.location.href);
      url.searchParams.delete('stack_activated');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const runScan = useCallback(
    async (tier: 'baseline' | 'deep') => {
      if (!user || !form.file) return;

      setRunning(tier);
      setResult(null);
      setError(null);
      lastTierRef.current = tier;
      progress.start();
      abortRef.current = new AbortController();

      if (form.file.size > 10 * 1024 * 1024) {
        progress.fail();
        setError('File must be under 10MB. Please upload a smaller file.');
        setRunning(null);
        return;
      }

      void captureLead({
        email: user.email,
        source: tier === 'deep' ? 'bloodwork_deep' : 'bloodwork_baseline',
        planInterest: 'premium',
        activityType: 'calculator_use',
        activityData: { goals: form.goals, scanType: tier },
      });

      try {
        const filePath = `${user.id}/${Date.now()}-${form.file.name}`;
        const { error: uploadError } = await supabase.storage.from('lab-reports').upload(filePath, form.file);
        if (uploadError) {
          console.error('[bloodwork] upload failed:', uploadError);
          throw new Error(`upload: ${uploadError.message}`);
        }

        const { data: report, error: insertError } = await supabase
          .from('lab_reports')
          .insert({
            user_id: user.id,
            file_url: filePath,
            file_name: form.file.name,
            status: 'pending',
          })
          .select()
          .single();
        if (insertError) {
          console.error('[bloodwork] insert failed:', insertError);
          throw new Error(`upload: ${insertError.message}`);
        }

        setLabReportId(report.id);
        progress.advance('extract');

        const base64 = await fileToBase64(form.file);
        progress.advance('generate');

        const { data, error: fnError } = await supabase.functions.invoke('analyze-lab-report', {
          body: {
            reportId: report.id,
            imageBase64: base64,
            fileName: form.file.name,
            mimeType: form.file.type,
            scanType: tier,
            age: form.age ? Number(form.age) : undefined,
            sex: form.sex,
            goals: form.goals,
            peptideHistoryUsed: form.peptideHistoryUsed ?? undefined,
            peptideHistoryNotes: form.peptideHistoryNotes || undefined,
          },
        });

        if (abortRef.current?.signal.aborted) {
          progress.reset();
          return;
        }

        if (fnError) {
          console.error('[bloodwork] edge function error:', fnError, data);
          const serverMsg =
            (data as any)?.error ||
            (data as any)?.message ||
            fnError.message;
          throw new Error(serverMsg || 'AI analysis failed');
        }
        if ((data as any)?.error) {
          console.error('[bloodwork] server returned error:', data);
          throw new Error((data as any).error);
        }
        const payload = (data as any)?.data;
        if (!payload) throw new Error('Empty AI response — please retry.');


        progress.advance('finalize');

        const scanResult: BloodworkScanResult = {
          scan_type: tier,
          health_score: payload.health_score ?? undefined,
          biomarkers: Array.isArray(payload.biomarkers) ? payload.biomarkers : [],
          insights: Array.isArray(payload.insights)
            ? payload.insights
            : typeof payload.insights === 'string'
            ? payload.insights.split(/\n+/).filter(Boolean)
            : [],
          protocol: payload.protocol || {},
          goals: form.goals,
        };
        progress.complete();
        // Brief delay so users see the 100% state
        await new Promise((r) => setTimeout(r, 350));
        setResult(scanResult);
        toast.success(`${tier === 'deep' ? 'Deep Decode' : 'Baseline'} scan complete`);
        setTimeout(() => {
          document.getElementById('bloodwork-results-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (e) {
        console.error('[bloodwork] scan failed:', e);
        const mapped = mapScanError(e) || 'Scan failed unexpectedly. Please retry.';
        progress.fail();
        setError(mapped);
        void captureLead({
          email: user.email,
          source: 'bloodwork_scan_failed',
          planInterest: 'premium',
          activityType: 'calculator_use',
          activityData: { tier, reason: e instanceof Error ? e.message : String(e) },
        });
      } finally {
        setRunning(null);
        abortRef.current = null;
      }
    },
    [user, form, progress]
  );

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    progress.reset();
    setRunning(null);
    setError(null);
  }, [progress]);

  const handleRetry = useCallback(() => {
    setError(null);
    progress.reset();
    if (lastTierRef.current) void runScan(lastTierRef.current);
  }, [progress, runScan]);

  const handleResetUpload = useCallback(() => {
    setError(null);
    progress.reset();
    setForm((s) => ({ ...s, file: null }));
  }, [progress]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    exportBloodworkProtocolPDF(result, `bloodwork-${result.scan_type}-${Date.now()}.pdf`);
  }, [result]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI Bloodwork Decoding & Peptide Protocols | Ride The Tide"
        description="Upload a lab report and get an AI-decoded biomarker breakdown with a personalised peptide stack, supplement plan, and retest schedule. Free baseline scan."
        canonical="https://ridethetide.info/bloodwork"
      />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'AI Bloodwork Decoding',
        provider: { '@type': 'Organization', name: 'Ride The Tide', url: 'https://ridethetide.info' },
        serviceType: 'Biomarker analysis and peptide protocol generation',
        url: 'https://ridethetide.info/bloodwork',
        description: 'AI-powered lab report analysis that decodes 20+ biomarkers and generates a personalised peptide protocol, supplement plan, and retest schedule.',
        areaServed: 'Worldwide',
      }} />

      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors" aria-label="Back">
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-foreground flex items-center gap-2">
              <FlaskConical size={18} className="text-primary" />
              Bloodwork → Protocol
            </h1>
            <p className="text-[11px] text-muted-foreground">Free · AI biomarker decoding · personalised stack</p>
          </div>
        </div>
      </header>

      {membershipLoading ? (
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-sm text-muted-foreground">Loading…</div>
      ) : !hasPremium ? (
        <>
          <PremiumGate onSignIn={() => setAuthOpen(true)} />
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </>
      ) : (
        <>
          {!result ? (
            <BloodworkWizard
              state={form}
              onChange={setForm}
              running={running}
              error={error}
              progress={{ stage: progress.stage, label: progress.label, percent: progress.percent }}
              onRun={runScan}
              onCancel={handleCancel}
              onRetry={handleRetry}
              onResetUpload={handleResetUpload}
            />
          ) : (
            <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
              {stackActivated && (
                <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 p-3 flex items-center gap-3">
                  <Sparkles size={18} className="text-primary shrink-0" />
                  <p className="text-xs text-foreground">
                    <span className="font-bold uppercase tracking-wider">Stack activated · </span>
                    Your reminders will be scheduled when you add this protocol to your dose tracker.
                  </p>
                </div>
              )}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => { setResult(null); setLabReportId(null); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card/40 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary/60 transition-colors"
                >
                  <ArrowLeft size={14} /> Run another scan
                </button>
              </div>
              <BloodworkResults result={result} onDownload={handleDownload} labReportId={labReportId} />
            </main>
          )}
        </>
      )}

      <footer className="border-t border-border/50 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Disclaimer · </span>
            {DISCLAIMER}
          </p>
        </div>
      </footer>
    </div>
  );
}
