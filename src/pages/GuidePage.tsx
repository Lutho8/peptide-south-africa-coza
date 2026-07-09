import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { guidePages, topPeptidesSlugs } from '@/data/entitySlugs';
import { corePeptides } from '@/data/peptides';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd, buildHowToSchema } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GradientCard } from '@/components/ui/GradientCard';

const BASE_URL = 'https://peptide-south-africa.co.za';

const guideContent: Record<string, { steps: Array<{ name: string; text: string }>; sections: Array<{ title: string; content: string }> }> = {
  reconstitution: {
    steps: [
      { name: 'Gather supplies', text: 'You will need: lyophilized peptide vial, bacteriostatic water (BAC water), alcohol swabs, and an insulin syringe (typically 1mL U-40 or U-100).' },
      { name: 'Clean vial tops', text: 'Wipe the rubber stoppers of both the peptide vial and BAC water vial with separate alcohol swabs. Allow to air dry for 10 seconds.' },
      { name: 'Draw bacteriostatic water', text: 'Using an insulin syringe, draw the desired amount of BAC water. Common volumes: 1mL or 2mL depending on your dosing concentration preference.' },
      { name: 'Inject water into peptide vial', text: 'Insert the needle into the peptide vial at an angle, aiming the stream of water at the glass wall — NOT directly onto the powder. This prevents damaging the peptide structure.' },
      { name: 'Gently swirl to dissolve', text: 'Gently roll the vial between your palms. Do NOT shake vigorously as this can denature the peptide. The solution should become clear within 1-3 minutes.' },
      { name: 'Calculate your dose', text: 'Use the formula: Volume to inject = (Desired dose ÷ Total peptide amount) × Total water added. Example: 5mg peptide + 2mL BAC water = 2.5mg/mL concentration.' },
      { name: 'Store properly', text: 'Store reconstituted peptide in the refrigerator at 2-8°C (36-46°F). Most reconstituted peptides remain stable for 28-30 days. Never freeze reconstituted peptides.' },
    ],
    sections: [
      { title: 'Why Bacteriostatic Water?', content: 'Bacteriostatic water contains 0.9% benzyl alcohol which prevents bacterial growth, making it safe for multi-dose vials. Never use sterile water for multi-use — it lacks preservatives and can harbor bacteria after first puncture.' },
      { title: 'Concentration Tips', content: 'Using less water creates a more concentrated solution (fewer units per dose, smaller injection volume). Using more water makes dosing easier to measure with standard syringes. For beginners, 2mL of BAC water per 5mg vial is a practical starting point.' },
      { title: 'Common Mistakes', content: 'Spraying water directly onto the peptide powder (damages it). Shaking the vial (denatures proteins). Using tap or distilled water (no preservative). Storing at room temperature (accelerates degradation). Re-freezing reconstituted solution.' },
    ]
  },
  injection: {
    steps: [
      { name: 'Wash hands thoroughly', text: 'Use soap and warm water for at least 20 seconds. Dry with a clean towel. This is the single most important step for preventing infection.' },
      { name: 'Prepare supplies', text: 'Gather: insulin syringe (U-40 recommended for peptides), alcohol swabs, reconstituted peptide vial, and a sharps container for disposal.' },
      { name: 'Draw your dose', text: 'Wipe the vial stopper with alcohol. Insert needle, invert vial, and draw the calculated number of units. Remove air bubbles by tapping the syringe gently and pushing the plunger slightly.' },
      { name: 'Select injection site', text: 'Common subcutaneous sites: abdomen (2 inches from navel), front of thighs, or back of upper arms. Rotate injection sites to prevent lipodystrophy.' },
      { name: 'Clean the site', text: 'Wipe the injection area with an alcohol swab in a circular motion from center outward. Allow to air dry completely — injecting through wet alcohol causes stinging.' },
      { name: 'Inject', text: 'Pinch a fold of skin. Insert the needle at a 45-90° angle (90° for thin needles like 31G). Inject slowly and steadily. Wait 5 seconds before withdrawing the needle.' },
      { name: 'Post-injection care', text: 'Apply light pressure with a cotton ball if there is any bleeding. Do not rub the site. Dispose of the needle in a sharps container immediately — never recap needles.' },
    ],
    sections: [
      { title: 'Needle Selection', content: 'For subcutaneous peptide injections, 29-31 gauge needles (insulin syringes) are standard. The higher the gauge, the thinner the needle. 31G is virtually painless for most people. U-40 syringes are preferred for peptide dosing as the markings align well with common dose calculations.' },
      { title: 'Injection Site Rotation', content: 'Divide your abdomen into quadrants and rotate between them. If using thighs, alternate between left and right, and vary the exact location each time. This prevents tissue damage and ensures consistent absorption.' },
      { title: 'Timing Considerations', content: 'GH secretagogues (Ipamorelin, CJC-1295): inject on an empty stomach, ideally before bed. BPC-157: can be injected near the injury site for localized effects. GLP-1 agonists: once-weekly injections at the same time each week.' },
    ]
  },
  bloodwork: {
    steps: [
      { name: 'Get baseline bloodwork', text: 'Before starting any peptide protocol, obtain comprehensive baseline bloodwork. This is your reference point for monitoring changes and ensuring safety.' },
      { name: 'Schedule follow-up at 8 weeks', text: 'Re-test the same panels at 8 weeks into your protocol. This gives enough time for changes to manifest while catching any adverse trends early.' },
      { name: 'Continue testing every 12 weeks', text: 'After the initial 8-week check, test every 12 weeks (quarterly) for the duration of your protocol. More frequent testing if any markers are out of range.' },
      { name: 'Review results with context', text: 'Compare each result to YOUR baseline, not just reference ranges. A value within range but dramatically different from your baseline warrants attention.' },
      { name: 'Adjust protocol based on results', text: 'If markers trend unfavorably, reduce dose or discontinue the responsible peptide. Resume testing 4-6 weeks after any protocol change to confirm correction.' },
    ],
    sections: [
      { title: 'Essential Panels', content: 'Complete Metabolic Panel (CMP): liver enzymes (AST, ALT), kidney function (BUN, creatinine), electrolytes, glucose. Complete Blood Count (CBC): red/white blood cells, platelets. Lipid Panel: total cholesterol, LDL, HDL, triglycerides. Hormone Panel: IGF-1, GH, testosterone (free and total), thyroid (TSH, free T3, free T4). Inflammatory Markers: CRP, ESR, homocysteine.' },
      { title: 'Peptide-Specific Markers', content: 'GH Secretagogues: IGF-1 is the primary marker — aim for 200-300 ng/dL. Watch fasting glucose as GH can impair insulin sensitivity. GLP-1 Agonists: monitor HbA1c, fasting insulin, lipase/amylase (pancreatic safety). Immune Peptides: CBC with differential, immunoglobulin levels. BPC-157/TB-500: standard CMP is sufficient for safety monitoring.' },
      { title: 'Where to Order', content: 'Many direct-to-consumer lab services offer comprehensive panels without a doctor\'s order. Look for panels specifically designed for hormone optimization or anti-aging protocols, as they include the relevant markers.' },
    ]
  }
};

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? guidePages[slug as keyof typeof guidePages] : undefined;
  const content = slug ? guideContent[slug] : undefined;

  if (!guide || !content || !slug) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Guide Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const otherGuides = Object.values(guidePages).filter(g => g.slug !== slug);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={guide.title} description={guide.description} canonical={`${BASE_URL}/guides/${slug}`} />
      <JsonLd
        data={buildHowToSchema(guide.title, guide.description, content.steps)}
        id={`guide-${slug}`}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4 text-sm">
          <ArrowLeft size={16} /> Back to Research Platform
        </Link>

        <Breadcrumbs items={[
          { label: 'Guides', href: '/guides/reconstitution' },
          { label: guide.title.split('–')[0].trim(), href: `/guides/${slug}` }
        ]} />

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{guide.title}</h1>
          <p className="text-muted-foreground">{guide.description}</p>
        </header>

        {/* Steps */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Step-by-Step Instructions</h2>
          <div className="space-y-4">
            {content.steps.map((step, i) => (
              <GradientCard key={i} className="p-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Additional Sections */}
        {content.sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
            <GradientCard>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
            </GradientCard>
          </section>
        ))}

        {/* Internal links: other guides */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherGuides.map(g => (
              <Link key={g.slug} to={`/guides/${g.slug}`}>
                <GradientCard hover className="p-3">
                  <p className="font-medium text-foreground text-sm">{g.title.split('–')[0].trim()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{g.description.slice(0, 80)}…</p>
                </GradientCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Internal links: popular peptides */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Popular Peptides</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(topPeptidesSlugs).slice(0, 8).map(([pSlug, pId]) => {
              const p = corePeptides.find((pp) => pp.id === pId);
              return p ? (
                <Link key={pSlug} to={`/peptides/${pSlug}`} className="px-3 py-1.5 rounded-full bg-muted/50 text-sm text-foreground hover:bg-primary/20 transition-colors">
                  {p.name}
                </Link>
              ) : null;
            })}
          </div>
        </section>

        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
          <p><strong>Disclaimer:</strong> This guide is for educational purposes only. Always follow sterile procedures and consult a healthcare provider.</p>
        </div>
      </div>
    </div>
  );
}
