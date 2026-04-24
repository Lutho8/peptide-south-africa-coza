import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '@/components/auth/AuthModal';
import { captureLead } from '@/lib/crm';

import { BloodworkHero } from '@/components/bloodwork/BloodworkHero';
import { ScanForm, ScanFormState, isFormReady } from '@/components/bloodwork/ScanForm';
import { ScanTierCards } from '@/components/bloodwork/ScanTierCards';
import { BloodworkResults, BloodworkScanResult } from '@/components/bloodwork/BloodworkResults';
import { PremiumGate } from '@/components/bloodwork/PremiumGate';
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

export default function BloodworkPage() {
  const { user } = useAuth();
  const { hasPremium, isLoading: membershipLoading } = useMembership();
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState<ScanFormState>(INITIAL_STATE);
  const [running, setRunning] = useState<'baseline' | 'deep' | null>(null);
  const [result, setResult] = useState<BloodworkScanResult | null>(null);

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
        toast.error('File must be under 10MB');
        return;
      }

      setRunning(tier);
      setResult(null);

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
        if (uploadError) throw uploadError;

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
        if (insertError) throw insertError;

        const base64 = await fileToBase64(form.file);

        const { data, error } = await supabase.functions.invoke('analyze-lab-report', {
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

        if (error) throw error;
        const payload = (data as any)?.data;
        if (!payload) throw new Error('Empty AI response');

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
        setResult(scanResult);
        toast.success(`${tier === 'deep' ? 'Deep Decode' : 'Baseline'} scan complete`);
        setTimeout(() => {
          document.getElementById('bloodwork-results-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Scan failed');
      } finally {
        setRunning(null);
      }
    },
    [user, form]
  );

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
          <Link
            to="/"
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Back"
          >
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
                <div>
                  <ScanTierCards ready={isFormReady(form)} running={running} onRun={runScan} />
                </div>
              </div>
            )}

            {result && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="mb-6 text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  ← Run another scan
                </button>
                <BloodworkResults result={result} onDownload={handleDownload} />
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
