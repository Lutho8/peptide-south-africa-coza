import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';
import { buildFAQSchema, buildBreadcrumbSchema } from '@/components/seo/JsonLd';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Are peptides legal in South Africa?',
    a: 'Peptides occupy a legal grey area under SAHPRA (South African Health Products Regulatory Authority). They are not classified as scheduled substances, but they are also not approved for human consumption. In practice, they are marketed and sold as research chemicals for laboratory use only. Researchers should stay informed about evolving regulations and ensure compliance with local laws.',
  },
  {
    q: 'Where can I buy research-grade peptides in South Africa?',
    a: 'Look for local suppliers that provide HPLC-tested peptides with Certificates of Analysis (COA) from independent labs like Janoshik. Reputable vendors ship nationally, accept payment in ZAR, and offer cold-chain delivery. Always verify the COA batch number matches your vial before use.',
  },
  {
    q: 'How do I reconstitute peptide powder?',
    a: 'Use bacteriostatic water (not sterile water) for multi-dose vials. Inject the diluent slowly down the inside wall of the vial — never directly onto the powder — to prevent foam and denaturation. Let it settle, then swirl gently. Do not shake. Most peptides dissolve within 1–2 minutes.',
  },
  {
    q: 'What is BPC-157?',
    a: 'BPC-157 (Body Protection Compound-157) is a synthetic pentadecapeptide derived from a protective protein found in human gastric juice. Research suggests it accelerates healing of tendons, ligaments, muscles, and the gut lining. It is one of the most studied research peptides for tissue repair.',
  },
  {
    q: 'BPC-157 vs TB-500 — what is the difference?',
    a: 'BPC-157 works primarily at the local site of injury, promoting angiogenesis and collagen formation. TB-500 (Thymosin Beta-4) has a more systemic effect, supporting cell migration and wound healing throughout the body. Many researchers stack them together for synergistic recovery.',
  },
  {
    q: 'How should I store peptides?',
    a: 'Lyophilised (powder) peptides should be kept in the refrigerator at 2–8°C or frozen at -20°C for long-term storage. Once reconstituted with bacteriostatic water, store in the fridge and use within 30 days. Always protect from light and avoid repeated temperature fluctuations.',
  },
  {
    q: 'What bloodwork should I do before starting peptides?',
    a: 'Baseline panels should include IGF-1, fasting glucose, HbA1c, liver enzymes (ALT/AST), a full blood count (FBC), and lipid profile. Depending on the specific peptide, additional markers like testosterone, estradiol, or thyroid function may be relevant. Retest every 8–12 weeks.',
  },
  {
    q: 'What is the difference between Semaglutide and Ozempic?',
    a: 'They are the same molecule — Ozempic is simply the pharmaceutical brand name manufactured by Novo Nordisk. Research-grade semaglutide is the identical GLP-1 receptor agonist peptide, but it is sold strictly for research purposes and is not approved for human use outside clinical trials.',
  },
  {
    q: 'What is Retatrutide?',
    a: 'Retatrutide is a triple hormone receptor agonist targeting GIP, GLP-1, and glucagon receptors. Currently in Phase 3 clinical trials, early data shows it produces greater fat loss than semaglutide. It represents the next generation of metabolic research peptides.',
  },
  {
    q: 'How do I track my peptide protocol?',
    a: 'Log your baseline bloodwork, record daily dose amounts and injection sites, and keep weekly notes on sleep, energy, and side effects. Use the free peptide tracker on this site to set reminders, monitor adherence, and correlate changes with biomarker trends over time.',
  },
];

const jsonLd = [
  buildFAQSchema(faqs),
  buildBreadcrumbSchema([
    { name: 'Home', url: 'https://peptide-south-africa.co.za/' },
    { name: 'FAQ', url: 'https://peptide-south-africa.co.za/faq' },
  ]),
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="FAQ | Peptide South Africa – Research Peptides Questions Answered"
        description="Frequently asked questions about research peptides in South Africa. Legality, sourcing, reconstitution, storage, bloodwork, BPC-157, TB-500, Semaglutide, Retatrutide, and protocol tracking."
        canonical="https://peptide-south-africa.co.za/faq"
        keywords="peptides South Africa, BPC-157, TB-500, Semaglutide, Retatrutide, peptide research, SAHPRA, reconstitute peptides, peptide storage, peptide bloodwork"
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-4 sm:mb-6 -ml-3 h-12 px-3 text-base">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Research peptide questions tailored for South African researchers.
            Always consult a qualified healthcare professional before use.
          </p>
        </header>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-border/60"
            >
              <AccordionTrigger className="py-5 text-left text-base sm:text-lg font-semibold hover:no-underline hover:text-primary transition-colors min-h-[56px]">
                <span className="pr-4">{faq.q}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pt-1">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 sm:mt-10 p-4 sm:p-6 rounded-xl bg-muted/50 border border-border/60">
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            Still have questions?{' '}
            <Link
              to="/live-qna"
              className="text-primary font-medium hover:underline"
            >
              Join our live Q&A
            </Link>{' '}
            or explore the{' '}
            <Link
              to="/blog"
              className="text-primary font-medium hover:underline"
            >
              research blog
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
