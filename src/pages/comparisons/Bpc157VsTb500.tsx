import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Syringe, Activity } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const BASE_URL = 'https://peptide-south-africa.co.za';
const URL = `${BASE_URL}/bpc-157-vs-tb-500`;

const rows: Array<{ label: string; bpc: string; tb: string }> = [
  {
    label: 'Mechanism',
    bpc: 'Cytoprotective pentadecapeptide; upregulates VEGF, modulates nitric oxide and growth-hormone receptor expression in injured tissue.',
    tb: 'Synthetic 17-amino-acid fragment of Thymosin Beta-4; binds G-actin, drives cell migration and angiogenesis.',
  },
  {
    label: 'Half-life',
    bpc: '~4 hours systemic; local tissue effects persist longer',
    tb: 'Short serum half-life, but actin-binding produces a much longer functional duration',
  },
  {
    label: 'Typical research dose',
    bpc: '250–500 mcg subcutaneous, 1–2× daily near injury site',
    tb: '2.0–2.5 mg subcutaneous, 2× weekly loading then weekly maintenance',
  },
  {
    label: 'Best research use case',
    bpc: 'Gut, tendon, ligament and joint injury models; local soft-tissue repair',
    tb: 'Systemic recovery, muscle injury, large-area wounds, scar remodelling',
  },
  {
    label: 'Onset of observed effect',
    bpc: 'Often within 1–2 weeks of consistent dosing',
    tb: 'Slower — typically 3–4 weeks before researchers report changes',
  },
  {
    label: 'Administration',
    bpc: 'Subcutaneous, intramuscular, or oral (gastric stability is unusual)',
    tb: 'Subcutaneous or intramuscular only',
  },
  {
    label: 'Stack synergy',
    bpc: 'Pairs with TB-500 (angiogenic + cytoprotective combo)',
    tb: 'Pairs with BPC-157; also studied with GHK-Cu for connective tissue',
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'BPC-157 vs TB-500 Research Comparison',
  description:
    'Side-by-side research comparison of BPC-157 and TB-500: mechanisms, dosing, onset, and when researchers reach for one versus the other.',
  url: URL,
  author: { '@type': 'Organization', name: 'Peptide South Africa' },
  publisher: {
    '@type': 'Organization',
    name: 'Peptide South Africa',
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon-512.png` },
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'BPC-157 vs TB-500', item: URL },
  ],
};

export default function Bpc157VsTb500() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="BPC-157 vs TB-500: Research Comparison | Peptide South Africa"
        description="Side-by-side research comparison of BPC-157 and TB-500: mechanisms, dosing, onset, and when researchers reach for one versus the other or stack them together."
        canonical={URL}
        jsonLd={[articleSchema, breadcrumbSchema]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4 text-sm">
          <ArrowLeft size={16} /> Back to Research Platform
        </Link>

        <Breadcrumbs items={[{ label: 'BPC-157 vs TB-500', href: '/bpc-157-vs-tb-500' }]} />

        <header className="mb-10">
          <Badge variant="outline" className="text-red-400 bg-red-500/10 mb-3">
            Comparison
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            BPC-157 vs TB-500 Research Comparison
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The two most-studied healing peptides in modern recovery research — different mechanisms, different
            timelines, and a well-documented synergy when stacked.
          </p>
        </header>

        {/* Comparison table */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-5">At a glance</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Attribute</TableHead>
                  <TableHead className="w-3/8">BPC-157</TableHead>
                  <TableHead className="w-3/8">TB-500</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.label}>
                    <TableCell className="font-medium text-foreground align-top">{r.label}</TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top">{r.bpc}</TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top">{r.tb}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Long-form content */}
        <section className="mb-10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">Origin and structure</h2>
            <p className="text-foreground/90 leading-relaxed">
              BPC-157 (Body Protection Compound) is a synthetic pentadecapeptide derived from a partial sequence of
              a protein discovered in human gastric juice. The 15-amino-acid sequence (GEPPPGKPADDAGLV) is unique in
              peptide research for its unusual oral stability — most peptides are degraded in the stomach, but
              BPC-157 was identified precisely because its parent protein survives there. TB-500 is a synthetic
              17-amino-acid fragment of Thymosin Beta-4, a naturally occurring 43-amino-acid protein abundant in
              platelets and present in nearly every cell of the body. Where BPC-157 is novel, TB-500 reproduces a
              functional domain of a protein that is already a primary driver of human wound healing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">Mechanistic differences</h2>
            <p className="text-foreground/90 leading-relaxed">
              BPC-157 acts as a broad-spectrum cytoprotective agent. Animal studies have documented upregulation
              of VEGF (driving new blood vessel formation), modulation of the nitric oxide system, increased
              expression of growth-hormone receptors at injury sites, and protection of gut mucosa against NSAID-,
              alcohol- and ulcer-induced damage. It accelerates tendon-to-bone healing in rat Achilles models and
              has demonstrated activity in nerve regeneration. TB-500 operates through a much narrower but powerful
              pathway: its actin-binding domain sequesters G-actin and drives directed cell migration into damaged
              tissue, kicking off angiogenesis, fibroblast recruitment and re-epithelialisation. The two peptides
              hit overlapping endpoints — more blood vessels, faster cell migration — through different upstream
              mechanisms, which is the entire pharmacological argument for stacking them.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">When researchers reach for which</h2>
            <p className="text-foreground/90 leading-relaxed">
              The pattern in published animal work and field reports is reasonably consistent. BPC-157 is the
              default for gut, tendon, ligament and small-area soft-tissue work, partly because its short half-life
              suits frequent local administration close to the injury site, and partly because of its near-unique
              oral bioavailability. TB-500 is reached for in larger systemic recovery situations — muscle tears,
              widespread tissue damage, scar remodelling — where its longer functional duration and systemic
              distribution matter more than precise local dosing. Onset timelines differ accordingly: researchers
              typically note BPC-157 effects within one to two weeks, while TB-500 results commonly take three to
              four weeks of consistent dosing before becoming evident.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">Why they're studied together</h2>
            <p className="text-foreground/90 leading-relaxed">
              The BPC-157 / TB-500 stack is one of the most widely documented combinations in equine veterinary
              literature, where both peptides are used extensively in racing recovery. The logical case is
              straightforward — BPC-157 provides cytoprotection, angiogenesis and local growth-factor expression
              while TB-500 drives the cell migration needed to actually populate the new vasculature with
              repairing tissue. The two have different time courses, so combining them produces both a fast
              cytoprotective response and a sustained remodelling phase. South African researchers studying either
              compound should source HPLC-tested material with a verifiable Certificate of Analysis; neither
              peptide is SAHPRA-approved for human use and both remain strictly research compounds.
            </p>
          </div>
        </section>

        {/* CTA cards to entity pages */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Full peptide profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/peptides/bpc-157">
              <GradientCard hover className="p-5 h-full">
                <Syringe className="text-primary mb-3" size={24} />
                <h3 className="font-semibold text-foreground mb-1">BPC-157 Full Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mechanism, dosing, half-life, reconstitution, COA verification and research references.
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                  View profile <ArrowRight size={14} />
                </span>
              </GradientCard>
            </Link>
            <Link to="/peptides/tb-500">
              <GradientCard hover className="p-5 h-full">
                <Activity className="text-primary mb-3" size={24} />
                <h3 className="font-semibold text-foreground mb-1">TB-500 Full Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Loading-phase dosing, actin-binding mechanism, expected timeline and research references.
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                  View profile <ArrowRight size={14} />
                </span>
              </GradientCard>
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Related Research Guides</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/bpc-157-dosage-guide-south-africa">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer h-full">
                <p className="font-medium text-foreground text-sm">BPC-157 Dosage Guide →</p>
                <p className="text-xs text-muted-foreground mt-1">Dose tables by goal, local vs systemic injection and the BPC-157 + TB-500 stack protocol.</p>
              </GradientCard>
            </Link>
            <Link to="/healing-peptides-south-africa">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer h-full">
                <p className="font-medium text-foreground text-sm">Healing Peptides South Africa →</p>
                <p className="text-xs text-muted-foreground mt-1">Category overview of peptides studied for tissue repair and recovery.</p>
              </GradientCard>
            </Link>
            <Link to="/peptide-storage-reconstitution-guide">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer h-full">
                <p className="font-medium text-foreground text-sm">Storage &amp; Reconstitution Guide →</p>
                <p className="text-xs text-muted-foreground mt-1">Correct storage temperatures and step-by-step BAC water reconstitution.</p>
              </GradientCard>
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">South African Researchers</h2>
          <GradientCard className="p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Peptides are an unscheduled grey area under SAHPRA — they are not approved for human use and are
              sold strictly for research purposes. Always source HPLC-tested material with a verifiable
              Certificate of Analysis, store correctly (lyophilised in the fridge or freezer; reconstituted in the
              fridge for up to 30 days), and review baseline bloodwork before beginning any research protocol.
            </p>
          </GradientCard>
        </section>

        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
          <p>
            <strong>Research Disclaimer:</strong> Information provided for educational and research purposes only.
            Not FDA or SAHPRA approved for human use. Consult a qualified healthcare provider before starting any
            protocol.
          </p>
        </div>
      </div>
    </div>
  );
}
