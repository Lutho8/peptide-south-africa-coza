import { Link } from 'react-router-dom';
import { ArrowLeft, Syringe, Clock, Target } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const BASE_URL = 'https://peptide-south-africa.co.za';
const URL = `${BASE_URL}/bpc-157-dosage-guide-south-africa`;

const dosageRows = [
  { goal: 'Gut repair / leaky gut', dose: '250 mcg', frequency: 'Twice daily', duration: '8–12 weeks', route: 'Oral or SubQ near abdomen' },
  { goal: 'Tendon / ligament injury', dose: '250–500 mcg', frequency: 'Once or twice daily', duration: '6–12 weeks', route: 'SubQ near injury site' },
  { goal: 'Joint inflammation', dose: '250 mcg', frequency: 'Twice daily', duration: '8 weeks', route: 'SubQ near joint' },
  { goal: 'Muscle tear recovery', dose: '500 mcg', frequency: 'Once daily', duration: '4–8 weeks', route: 'IM or SubQ near site' },
  { goal: 'Systemic recovery / general wellbeing', dose: '250 mcg', frequency: 'Once daily', duration: '8–12 weeks', route: 'SubQ abdomen' },
  { goal: 'Neurological / brain injury models', dose: '10 mcg/kg', frequency: 'Once daily', duration: '4 weeks', route: 'IP (animal models)' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'BPC-157 Dosage Guide South Africa',
  description: 'Complete BPC-157 dosage guide for South African researchers: dose tables by goal, half-life, local vs systemic injection, cycle lengths and the TB-500 stack.',
  url: URL,
  author: { '@type': 'Organization', name: 'Peptide South Africa' },
  publisher: {
    '@type': 'Organization',
    name: 'Peptide South Africa',
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon-512.png` },
  },
};

export default function Bpc157DosageGuideSA() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="BPC-157 Dosage Guide South Africa | Peptide South Africa"
        description="Complete BPC-157 dosage guide: dose tables by research goal, half-life explained, local vs systemic injection, cycle lengths and the BPC-157 + TB-500 stack protocol."
        canonical={URL}
        jsonLd={articleSchema}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4 text-sm">
          <ArrowLeft size={16} /> Back to Research Platform
        </Link>

        <Breadcrumbs items={[{ label: 'BPC-157 Dosage Guide South Africa', href: '/bpc-157-dosage-guide-south-africa' }]} />

        <header className="mb-10">
          <Badge variant="outline" className="text-green-400 bg-green-500/10 mb-3">
            Research Guide
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            BPC-157 Dosage Guide South Africa
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            BPC-157 (Body Protection Compound-157) is a synthetic pentadecapeptide derived from a protective protein found in gastric juice. It is among the most extensively studied peptides for tissue repair, gut health and musculoskeletal recovery. This guide covers dosing protocols, half-life, injection approach and the popular BPC-157 + TB-500 stack.
          </p>
        </header>

        {/* Section 1: What it is */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-primary" size={22} />
            <h2 className="text-2xl font-semibold">Mechanism & Half-Life</h2>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            BPC-157 accelerates healing by upregulating vascular endothelial growth factor (VEGF), which promotes angiogenesis — the formation of new blood vessels to supply damaged tissue. It also modulates nitric oxide synthesis (stimulating eNOS while dampening iNOS-driven inflammation), and has been shown to upregulate growth hormone receptor expression in healing tissue, which amplifies downstream GH signalling without raising systemic GH levels.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Its serum half-life is approximately 4 hours after subcutaneous injection, which is why most protocols split the daily dose into morning and evening administrations. However, tissue-level effects (particularly in tendons and ligaments, which are poorly vascularised) persist far longer — animal model data suggests ongoing structural remodelling for weeks after injection has stopped, attributed to the sustained angiogenic response rather than direct peptide presence.
          </p>
          <GradientCard className="p-5 mb-4">
            <p className="font-semibold text-foreground mb-1">Oral vs Injectable BPC-157</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              BPC-157 is one of the few peptides with demonstrated oral stability — it resists gastric acid degradation due to its proline-rich sequence. Oral administration reaches the gut epithelium directly, making it the preferred route for gut permeability, inflammatory bowel and gastric ulcer research. Injectable (SubQ or IM) routes are used when the research target is musculoskeletal rather than gastrointestinal.
            </p>
          </GradientCard>
        </section>

        {/* Section 2: Dosage table */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Syringe className="text-primary" size={22} />
            <h2 className="text-2xl font-semibold">Dosage Reference by Research Goal</h2>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            Doses below are based on published animal-model research scaled to approximate human equivalents using body surface area (BSA) methodology. All figures are for laboratory research reference only.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Research Goal</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Route</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosageRows.map((r) => (
                  <TableRow key={r.goal}>
                    <TableCell className="font-medium text-sm">{r.goal}</TableCell>
                    <TableCell className="text-sm">{r.dose}</TableCell>
                    <TableCell className="text-sm">{r.frequency}</TableCell>
                    <TableCell className="text-sm">{r.duration}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.route}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Section 3: Injection sites */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-primary" size={22} />
            <h2 className="text-2xl font-semibold">Local vs Systemic Injection</h2>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            A key decision in BPC-157 research protocols is whether to inject near the injury site (local) or remotely (systemic). Animal model evidence generally supports local injection for musculoskeletal targets: injecting subcutaneously within 2–3 cm of a tendon tear or ligament injury produces faster vascularisation at the injury site compared to distal SubQ injection. The reasoning is that the local angiogenic stimulus is concentrated where it is needed.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            For gut-related research, subcutaneous injection anywhere (typically the abdomen) is effective since BPC-157 reaches the gut via systemic circulation. Oral administration remains the most direct route for gut epithelial effects.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Common SubQ injection sites used in research: abdomen (2–3 cm from navel), lateral thigh, and site-specific subcutaneous tissue near the target joint or muscle. 27–31G insulin syringes are standard for SubQ administration. Intramuscular (IM) administration is used less frequently — typically only where rapid uptake to deep muscle tissue is desired.
          </p>
        </section>

        {/* Section 4: Cycle length */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-primary" size={22} />
            <h2 className="text-2xl font-semibold">Cycle Length & Off-Protocol Periods</h2>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            The most commonly used research protocols run 8–12 weeks of continuous BPC-157 administration followed by a break of 4–6 weeks before resuming. This is precautionary — there are no published data on receptor downregulation or long-term toxicity at typical research doses, but the break period is standard practice in peptide research to allow baseline restoration of any upregulated pathways.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            For acute injury research (e.g. a fresh tendon tear), shorter cycles of 4–6 weeks starting immediately post-injury are common, with the protocol ending once histological markers of healing reach target endpoints rather than a fixed calendar stop.
          </p>
        </section>

        {/* Section 5: TB-500 stack */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">BPC-157 + TB-500 Stack Protocol</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            The BPC-157 + TB-500 combination is the most researched peptide stack for musculoskeletal injury. The two peptides work on complementary mechanisms: BPC-157 is cytoprotective and angiogenic at the injury site, while TB-500 (a synthetic fragment of Thymosin Beta-4) drives systemic cell migration, large-area angiogenesis and scar remodelling. Together they address both local vascularisation and systemic regenerative signalling.
          </p>
          <GradientCard className="p-5">
            <p className="font-semibold text-foreground mb-3">Common Stack Protocol (8-week):</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="text-foreground font-medium">BPC-157:</span> 250–500 mcg SubQ near injury, twice daily, 7 days/week for 8 weeks</li>
              <li><span className="text-foreground font-medium">TB-500 (loading phase, weeks 1–2):</span> 2.0–2.5 mg SubQ, twice weekly</li>
              <li><span className="text-foreground font-medium">TB-500 (maintenance phase, weeks 3–8):</span> 2.0 mg SubQ, once weekly</li>
              <li><span className="text-foreground font-medium">Post-cycle:</span> 4–6 weeks off both peptides</li>
            </ul>
          </GradientCard>
        </section>

        {/* Internal links */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Related Research Pages</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/peptide-storage-reconstitution-guide">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer">
                <p className="font-medium text-foreground text-sm">Peptide Storage & Reconstitution Guide →</p>
                <p className="text-xs text-muted-foreground mt-1">How to store lyophilised peptides and reconstitute safely with BAC water.</p>
              </GradientCard>
            </Link>
            <Link to="/bpc-157-vs-tb-500">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer">
                <p className="font-medium text-foreground text-sm">BPC-157 vs TB-500 Comparison →</p>
                <p className="text-xs text-muted-foreground mt-1">Side-by-side mechanism, dosing and use-case comparison.</p>
              </GradientCard>
            </Link>
            <Link to="/healing-peptides-south-africa">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer">
                <p className="font-medium text-foreground text-sm">Healing Peptides South Africa →</p>
                <p className="text-xs text-muted-foreground mt-1">Category overview of peptides studied for tissue repair and recovery.</p>
              </GradientCard>
            </Link>
            <Link to="/peptides-for-women-south-africa">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer">
                <p className="font-medium text-foreground text-sm">Peptides for Women South Africa →</p>
                <p className="text-xs text-muted-foreground mt-1">How BPC-157 dosing considerations differ for female research subjects.</p>
              </GradientCard>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
