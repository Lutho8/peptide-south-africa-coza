import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqCategories = [
  {
    id: 'general',
    title: 'General',
    faqs: [
      {
        q: 'What are peptides?',
        a: 'Peptides are short chains of amino acids (typically 2–50) linked by peptide bonds. They act as signaling molecules in the body, influencing processes like growth, metabolism, immune response, and tissue repair. Unlike larger proteins, their smaller size allows them to be absorbed more efficiently.',
      },
      {
        q: "What's the difference between peptides and proteins?",
        a: 'The main difference is size. Peptides generally contain fewer than 50 amino acids, while proteins are larger and more complex. Peptides tend to have more targeted, specific functions, while proteins serve broader structural and enzymatic roles in the body.',
      },
      {
        q: 'How do peptides work in the body?',
        a: 'Peptides bind to specific receptors on cell surfaces, triggering biological responses. For example, growth hormone-releasing peptides stimulate the pituitary gland, while BPC-157 promotes angiogenesis and tissue repair. Each peptide has a unique mechanism of action based on its amino acid sequence.',
      },
      {
        q: 'Are peptides the same as steroids?',
        a: 'No. Steroids are synthetic versions of hormones like testosterone, while peptides are chains of amino acids that signal the body to produce its own hormones or trigger specific biological processes. Peptides generally work with the body\'s natural systems rather than replacing them.',
      },
      {
        q: 'Are peptides legal?',
        a: 'Many peptides are legal to purchase for research purposes. Some peptides, like certain GLP-1 agonists (semaglutide, tirzepatide), are FDA-approved medications available by prescription. Regulations vary by country, and most non-approved peptides are sold labeled "for research use only."',
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety',
    faqs: [
      {
        q: 'Are peptides safe?',
        a: 'FDA-approved peptides have undergone rigorous clinical trials and are considered safe when used as directed. Research peptides have varying levels of evidence. Safety depends on the specific peptide, dosage, purity, and individual health factors. Always consult a healthcare professional before use.',
      },
      {
        q: "What does 'research chemical' mean for peptides?",
        a: 'A "research chemical" designation means the peptide has not been FDA-approved for human use. It is sold for laboratory and scientific research purposes only. This does not necessarily mean it is unsafe, but it indicates insufficient clinical data for regulatory approval.',
      },
      {
        q: 'How are peptides typically administered?',
        a: 'Most research peptides are administered via subcutaneous injection using insulin syringes. Some peptides are available as oral capsules, nasal sprays, or topical creams. The administration route depends on the peptide\'s bioavailability and intended mechanism of action.',
      },
      {
        q: 'Why are some peptides FDA approved and others not?',
        a: 'FDA approval requires extensive Phase I–III clinical trials demonstrating safety, efficacy, and manufacturing quality. This process takes years and costs hundreds of millions of dollars. Many peptides show promise in preclinical research but lack the commercial investment needed for full FDA approval.',
      },
      {
        q: 'What are common side effects of peptides?',
        a: 'Common side effects vary by peptide but may include injection site reactions (redness, swelling), water retention, increased hunger or decreased appetite, headaches, and fatigue. GH-releasing peptides may cause tingling or numbness. Serious side effects are rare but possible with improper dosing.',
      },
    ],
  },
  {
    id: 'peptide-types',
    title: 'Peptide Types',
    faqs: [
      {
        q: 'What are Growth Hormone Secretagogues?',
        a: 'Growth Hormone Secretagogues (GHS) are peptides that stimulate the pituitary gland to release growth hormone. Examples include CJC-1295, Ipamorelin, GHRP-6, and MK-677. They are researched for anti-aging, muscle growth, fat loss, and improved recovery.',
      },
      {
        q: 'What are healing peptides?',
        a: 'Healing peptides like BPC-157, TB-500, and GHK-Cu promote tissue repair, reduce inflammation, and accelerate recovery. BPC-157, derived from a gastric protein, is researched for gut healing, tendon repair, and neuroprotection. TB-500 promotes cell migration and new blood vessel formation.',
      },
      {
        q: 'What are cognitive or nootropic peptides?',
        a: 'Cognitive peptides like Semax, Selank, and Dihexa are researched for their effects on brain function. They may enhance memory, focus, neuroplasticity, and neuroprotection. Semax and Selank have been used clinically in Russia for cognitive and anxiety-related conditions.',
      },
      {
        q: 'What are GLP-1 peptides?',
        a: 'GLP-1 (Glucagon-Like Peptide-1) receptor agonists like semaglutide and tirzepatide mimic the incretin hormone GLP-1. They regulate blood sugar, slow gastric emptying, and reduce appetite. Several are FDA-approved for type 2 diabetes and weight management.',
      },
      {
        q: 'What are cosmetic peptides?',
        a: 'Cosmetic peptides like GHK-Cu, Matrixyl, and Argireline are used in skincare for anti-aging benefits. They stimulate collagen production, improve skin elasticity, reduce wrinkles, and promote wound healing. GHK-Cu is also researched for hair regrowth.',
      },
    ],
  },
  {
    id: 'practical',
    title: 'Practical',
    faqs: [
      {
        q: 'How should peptides be stored?',
        a: 'Lyophilized (freeze-dried) peptides should be stored in a cool, dry place, ideally refrigerated at 2–8°C. Once reconstituted with bacteriostatic water, they must be refrigerated and typically used within 4–6 weeks. Avoid repeated freeze-thaw cycles and direct sunlight.',
      },
      {
        q: 'How are peptides reconstituted?',
        a: 'Peptides are reconstituted by adding bacteriostatic water to the lyophilized powder. Inject the water slowly along the vial wall to avoid damaging the peptide. Gently swirl—never shake—until dissolved. Use our Reconstitution Calculator for precise measurements based on your desired concentration.',
      },
    ],
  },
  {
    id: 'about',
    title: 'About Ride The Tide',
    faqs: [
      {
        q: 'What is Ride The Tide?',
        a: 'Ride The Tide is a comprehensive peptide research database featuring 98+ peptides with detailed profiles, mechanisms of action, clinical research citations, dosage calculators, and stacking tools. It serves as an educational resource for researchers and enthusiasts.',
      },
      {
        q: 'How is the information sourced?',
        a: 'Our database is built from peer-reviewed scientific literature, clinical trial data (ClinicalTrials.gov), FDA documentation, and established pharmacological references. Each peptide profile includes citations to primary research sources.',
      },
      {
        q: 'How often is the database updated?',
        a: 'We regularly update our database as new research is published and clinical trials conclude. Peptide profiles, safety data, and research references are reviewed and updated on an ongoing basis to ensure accuracy.',
      },
      {
        q: 'Is Ride The Tide medical advice?',
        a: 'No. Ride The Tide is strictly an educational and research resource. The information provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before making any decisions related to peptide use.',
      },
    ],
  },
];

export function FAQSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about peptides, their uses, safety considerations, and how to use Ride The Tide.
          </p>
        </motion.div>

        {/* Category jump links */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {faqCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#faq-${cat.id}`}
              className="px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-accent/20 text-muted-foreground hover:text-accent transition-colors"
            >
              {cat.title}
            </a>
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-10">
          {faqCategories.map((category, catIdx) => (
            <motion.div
              key={category.id}
              id={`faq-${category.id}`}
              className="scroll-mt-24"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: catIdx * 0.05 }}
            >
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                <span className="w-1.5 h-7 bg-accent rounded-full" />
                {category.title}
              </h3>
              <Accordion type="single" collapsible className="space-y-2">
                {category.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`${category.id}-${i}`}
                    className="glass-card rounded-xl border-border/50 px-2"
                  >
                    <AccordionTrigger className="text-left text-sm md:text-base hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
