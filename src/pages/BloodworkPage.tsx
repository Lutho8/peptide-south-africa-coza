import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '@/components/auth/AuthModal';
import { captureLead } from '@/lib/crm';

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
  const lastTierRef = useRef<'baseline' | 'deep' | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const progress = useScanProgress();

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
      if (form.file.size > 10 * 1024 * 1024) {
        setError('File must be under 10MB. Please upload a smaller file.');
        return;
      }

      setRunning(tier);
      setResult(null);
      setError(null);
      lastTierRef.current = tier;
      progress.start();
      abortRef.current = new AbortController();

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
        if (uploadError) throw new Error(`upload: ${uploadError.message}`);

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
        if (insertError) throw new Error(`upload: ${insertError.message}`);

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

        if (fnError) throw new Error(fnError.message || 'AI analysis failed');
        const payload = (data as any)?.data;
        if (!payload) throw new Error('Empty AI response');

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
        const mapped = mapScanError(e);
        progress.fail();
        if (mapped) {
          setError(mapped);
          void captureLead({
            email: user.email,
            source: 'bloodwork_scan_failed',
            planInterest: 'premium',
            activityType: 'calculator_use',
            activityData: { tier, reason: e instanceof Error ? e.message : String(e) },
          });
        } else {
          progress.reset();
        }
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
        title="Bloodwork → Protocol | Ride The Tide Premium"
        description="Premium AI bloodwork decoding: extract biomarkers, score your health, and receive a personalised peptide stack, supplements, nutrition, and retest schedule."
      />

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
            <p className="text-[11px] text-muted-foreground">Premium · AI biomarker decoding · personalised stack</p>
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
          <BloodworkHero />

          <main className="max-w-5xl mx-auto px-4 py-10 pb-24">
            {!result && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-10">
                <div>
                  <ScanForm state={form} onChange={setForm} disabled={running !== null} />
                </div>
                <div className="space-y-4 lg:sticky lg:top-20 self-start">
                  {error ? (
                    <ScanError message={error} onRetry={handleRetry} onReset={handleResetUpload} />
                  ) : running ? (
                    <ScanProgress
                      stage={progress.stage}
                      label={progress.label}
                      percent={progress.percent}
                      onCancel={handleCancel}
                    />
                  ) : (
                    <ScanTierCards ready={isFormReady(form)} running={running} onRun={runScan} />
                  )}
                </div>
              </div>
            )}

            {result && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setLabReportId(null);
                  }}
                  className="mb-6 text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  ← Run another scan
                </button>
                <BloodworkResults result={result} onDownload={handleDownload} labReportId={labReportId} />
              </div>
            )}
          </main>
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
