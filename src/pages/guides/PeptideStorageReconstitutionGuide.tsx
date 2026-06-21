import { Link } from 'react-router-dom';
import { ArrowLeft, Thermometer, FlaskConical, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const BASE_URL = 'https://peptide-south-africa.co.za';
const URL = `${BASE_URL}/peptide-storage-reconstitution-guide`;

const storageRows = [
  { peptide: 'BPC-157', lyophilised: '2–8 °C (fridge), up to 24 months', reconstituted: '4 °C, use within 30 days', notes: 'Keep away from light; stable at RT for short transit' },
  { peptide: 'TB-500', lyophilised: '−20 °C preferred, fridge acceptable short-term', reconstituted: '4 °C, use within 30 days', notes: 'More stable than most peptides; tolerates brief RT' },
  { peptide: 'Semaglutide', lyophilised: '−20 °C', reconstituted: '4 °C, use within 28 days', notes: 'Pharmaceutical pens keep at RT up to 56 days once in use' },
  { peptide: 'Tirzepatide', lyophilised: '−20 °C', reconstituted: '4 °C, use within 28 days', notes: 'Same class as semaglutide; similar stability profile' },
  { peptide: 'GHK-Cu', lyophilised: '−20 °C, light-protected', reconstituted: '4 °C, use within 14 days', notes: 'Copper chelate is sensitive to oxidation; amber vial strongly recommended' },
  { peptide: 'Epithalon', lyophilised: '−20 °C', reconstituted: '4 °C, use within 21 days', notes: 'Tetrapeptide; relatively stable but degrade faster than larger peptides at RT' },
  { peptide: 'PT-141', lyophilised: '−20 °C', reconstituted: '4 °C, use within 21 days', notes: 'Melanocortin peptide; light-sensitive' },
  { peptide: 'MOTS-c', lyophilised: '−20 °C', reconstituted: '4 °C, use within 14 days', notes: 'Mitochondrial peptide; treat like GHK-Cu — light and heat sensitive' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Store and Reconstitute Peptides — South Africa Guide',
  description: 'Step-by-step guide to storing lyophilised research peptides and reconstituting them with bacteriostatic water, with South African climate considerations.',
  url: URL,
  step: [
    { '@type': 'HowToStep', name: 'Check storage requirements', text: 'Confirm whether your peptide needs −20 °C (freezer) or 2–8 °C (fridge) storage in lyophilised form.' },
    { '@type': 'HowToStep', name: 'Gather supplies', text: 'You need: bacteriostatic water (BAC water), 1 mL insulin syringe, 18–21G needle for drawing BAC water, alcohol swabs.' },
    { '@type': 'HowToStep', name: 'Calculate volume', text: 'Decide your target concentration (e.g. 1 mg/mL = add 1 mL BAC water per 1 mg peptide). Use a peptide calculator to confirm.' },
    { '@type': 'HowToStep', name: 'Reconstitute', text: 'Swab the vial septum. Insert needle at an angle. Let BAC water run down the vial wall — do not jet it directly onto the powder. Swirl gently; never vortex.' },
    { '@type': 'HowToStep', name: 'Store reconstituted peptide', text: 'Store in the fridge at 2–8 °C. Label with date. Discard after the peptide-specific window (14–30 days depending on peptide).' },
  ],
};


const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What water should I use to reconstitute peptides?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use bacteriostatic water (BAC water) for multi-dose vials. It contains 0.9% benzyl alcohol which prevents microbial contamination. Sterile water is only suitable for single-dose applications. Do not use saline — the ionic environment can accelerate degradation in some peptides.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long can you store reconstituted peptides?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Reconstituted peptides stored in the fridge at 2–8°C typically last 14–30 days depending on the peptide. BPC-157 and TB-500 are stable for up to 30 days reconstituted. GHK-Cu, PT-141, and MOTS-c should be used within 14–21 days. Never freeze a reconstituted peptide as freeze-thaw cycles rapidly degrade them.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I freeze reconstituted peptides?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Once a peptide is reconstituted with bacteriostatic water, do not freeze it. Freeze-thaw cycles cause ice crystal formation that shears peptide bonds and rapidly degrades the compound. Store reconstituted peptides only in the fridge at 2–8°C and use within the specified window (14–30 days).',
      },
    },
    {
      '@type': 'Question',
      name: 'How should I store lyophilised (powder) peptides in South Africa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most lyophilised peptides can be stored in the fridge at 2–8°C for 12–24 months. For longer storage or heat-sensitive peptides (semaglutide, tirzepatide, GHK-Cu), use a freezer at −20°C. South Africa's summer temperatures frequently exceed 30°C — ensure peptides are not left in cars, postal depots or warehouses during heatwaves, as even short exposure can cause significant degradation.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I reconstitute peptides step by step?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '1) Calculate target concentration (e.g. add 1 mL BAC water per 1 mg peptide for 1 mg/mL). 2) Swab both vial septa with 70% isopropyl alcohol. 3) Draw BAC water using an 18–21G needle. 4) Insert needle at 45° angle into peptide vial and let BAC water run slowly down the glass wall — do not jet onto powder. 5) Swirl gently for 10–20 seconds. 6) Label with date and store in fridge at 2–8°C.',
      },
    },
  ],
};

export default function PeptideStorageReconstitutionGuide() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Peptide Storage & Reconstitution Guide South Africa | Peptide South Africa"
        description="Complete guide to storing lyophilised peptides and reconstituting with BAC water. Includes temperature requirements, South African climate considerations, and quick-reference storage table."
        canonical={URL}
        jsonLd={[articleSchema, faqSchema]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4 text-sm">
          <ArrowLeft size={16} /> Back to Research Platform
        </Link>

        <Breadcrumbs items={[{ label: 'Peptide Storage & Reconstitution Guide', href: '/peptide-storage-reconstitution-guide' }]} />

        <header className="mb-10">
          <Badge variant="outline" className="text-blue-400 bg-blue-500/10 mb-3">
            Research Guide
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Peptide Storage & Reconstitution Guide South Africa
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Lyophilised peptides are fragile. Improper storage or sloppy reconstitution degrades the active compound before it ever reaches a research subject. This guide covers what you need to know — with South African climate considerations included.
          </p>
        </header>

        {/* Section 1: Storage */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="text-primary" size={22} />
            <h2 className="text-2xl font-semibold">Storage Requirements</h2>
          </div>
          <GradientCard className="mb-6 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-400 mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-foreground mb-1">South African climate warning</p>
                <p className="text-muted-foreground text-sm">
                  South Africa's summer ambient temperatures frequently exceed 30 °C in Gauteng, the Western Cape, and KwaZulu-Natal. Lyophilised peptides left in a car, postal depot or courier warehouse during a heatwave can degrade significantly within hours. Always specify temperature-controlled courier options and confirm your delivery won't sit in a hot depot over a weekend.
                </p>
              </div>
            </div>
          </GradientCard>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            Most lyophilised (freeze-dried) peptides arrive as a white powder sealed under nitrogen or vacuum in a glass vial. In this form they are far more stable than once reconstituted — many can be stored at fridge temperature (2–8 °C) for 12–24 months without significant degradation. A freezer (−20 °C) extends this further and is mandatory for peptides with a shorter stability window.
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Once reconstituted with water, peptides degrade significantly faster. The bacteriostatic agent in BAC water (0.9% benzyl alcohol) prevents microbial contamination but does not stop chemical hydrolysis, oxidation or aggregation of the peptide chains. This is why reconstituted vials should always be stored in the fridge, used within the window specified per peptide, and never refrozen (freeze-thaw cycles degrade peptides rapidly).
          </p>

          <h3 className="text-xl font-semibold mb-3">Storage Quick Reference</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peptide</TableHead>
                  <TableHead>Lyophilised</TableHead>
                  <TableHead>Reconstituted</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storageRows.map((r) => (
                  <TableRow key={r.peptide}>
                    <TableCell className="font-medium">{r.peptide}</TableCell>
                    <TableCell className="text-sm">{r.lyophilised}</TableCell>
                    <TableCell className="text-sm">{r.reconstituted}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Section 2: Reconstitution */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="text-primary" size={22} />
            <h2 className="text-2xl font-semibold">4-Step Reconstitution Protocol</h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Bacteriostatic water (BAC water) is the standard diluent for most research peptides. It contains 0.9% benzyl alcohol, which suppresses microbial growth in multi-use vials. Sterile water for injection is used for single-dose applications but is not suitable for vials that will be accessed multiple times. Do not use saline for peptide reconstitution — the ionic environment can accelerate degradation in some peptides.
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                step: '1',
                title: 'Gather supplies',
                body: 'You need: bacteriostatic water (BAC water), 1 mL insulin syringe (27–31G), a larger-bore 18–21G needle or blunt-tip for drawing from the BAC water vial, alcohol swabs (70% isopropyl), and the peptide vial. Keep everything on a clean, flat surface.',
              },
              {
                step: '2',
                title: 'Calculate your target concentration',
                body: 'Decide how concentrated you want the solution. A common choice is 1 mg/mL — for a 5 mg vial this means adding 5 mL BAC water. Some researchers prefer 2 mg/mL (add 2.5 mL for a 5 mg vial) to reduce injection volume. Use a peptide reconstitution calculator to confirm maths before drawing.',
              },
              {
                step: '3',
                title: 'Reconstitute — technique matters',
                body: 'Swab both vial septa with an alcohol wipe. Draw the calculated volume of BAC water. Insert the needle into the peptide vial at a 45° angle and let the water run slowly down the glass wall — do not jet it directly onto the lyophilised powder. This minimises mechanical disruption of peptide chains. Swirl gently for 10–20 seconds until clear. Never vortex, shake vigorously, or heat.',
              },
              {
                step: '4',
                title: 'Label and store',
                body: 'Label the vial with the peptide name, concentration, reconstitution date, and expiry date (based on the peptide-specific window from the table above). Store capped in the fridge at 2–8 °C away from light. If you used a standard insulin vial that was not amber-tinted, wrap it in foil.',
              },
            ].map(({ step, title, body }) => (
              <GradientCard key={step} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                    {step}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Section 3: Common mistakes */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-green-400" size={22} />
            <h2 className="text-2xl font-semibold">Common Mistakes to Avoid</h2>
          </div>
          <ul className="space-y-3">
            {[
              'Using saline instead of BAC water for multi-dose vials — saline has no antimicrobial protection.',
              'Jetting BAC water directly onto the powder — the impact force can shear peptide bonds.',
              'Vortexing or shaking vigorously — mechanical agitation creates air bubbles and promotes aggregation.',
              'Leaving reconstituted peptide at room temperature — even a few hours on a countertop accelerates degradation.',
              'Freezing reconstituted peptide — freeze-thaw cycles are highly destructive; once reconstituted, keep it in the fridge only.',
              'Ignoring heat during South African summer transit — a vial that arrived warm may already be significantly degraded.',
              'Storing under fluorescent lighting — UV and visible light degrades many peptides, especially GHK-Cu and PT-141.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                <span className="text-red-400 mt-0.5">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Internal links */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Related Research Pages</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/bpc-157-dosage-guide-south-africa">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer">
                <p className="font-medium text-foreground text-sm">BPC-157 Dosage Guide South Africa →</p>
                <p className="text-xs text-muted-foreground mt-1">Dosage tables, injection sites, cycle lengths and the TB-500 stack protocol.</p>
              </GradientCard>
            </Link>
            <Link to="/healing-peptides-south-africa">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer">
                <p className="font-medium text-foreground text-sm">Healing Peptides South Africa →</p>
                <p className="text-xs text-muted-foreground mt-1">BPC-157, TB-500 and GHK-Cu for tissue recovery and injury research.</p>
              </GradientCard>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
