import { Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Globe } from 'lucide-react';
import { BiomarkerInsights } from '@/components/biomarkers/BiomarkerInsights';
import { SEOHead } from '@/components/seo/SEOHead';

export default function BloodworkPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Bloodwork Upload & AI Analysis | Ride The Tide"
        description="Upload your bloodwork PDF in English or German. Get layman-friendly explanations and a ranked list of peptide optimization suggestions for each biomarker."
      />

      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
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
              Bloodwork Analysis
            </h1>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Globe size={10} />
              English & German PDFs · plain-English insights · peptide rankings
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 pb-24">
        <BiomarkerInsights />

        <div className="mt-6 p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground mb-1">Research disclaimer</p>
          <p>
            All biomarker explanations and peptide suggestions are for educational and
            research purposes only. They are not medical advice. Peptides referenced are
            not FDA-approved for the indications discussed. Consult a qualified
            healthcare provider before making any changes based on lab findings.
          </p>
        </div>
      </main>
    </div>
  );
}
