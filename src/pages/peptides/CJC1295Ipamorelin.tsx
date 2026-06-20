import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, Stethoscope, Shield, ChevronDown, FlaskConical, AlertTriangle, Pill, BookOpen, Globe, Banknote } from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../../components/pages/AnimatedSection'

const compound = {
  name: 'CJC-1295 + Ipamorelin',
  synonyms: ['GH secretagogue stack', 'CJC-1295 with DAC', 'CJC-1295 no DAC (Mod GRF 1-29)', 'Ipamorelin'],
  casNumber: 'CJC-1295: 863288-34-0; Ipamorelin: 170851-70-4',
  molecularFormula: 'CJC-1295: C152H252N44O42; Ipamorelin: C38H49N9O5',
  molecularWeight: 'CJC-1295: 3367.9 g/mol; Ipamorelin: 711.9 g/mol',
  aminoAcidSequence: 'CJC-1295: 30 aa modified GHRH; Ipamorelin: 5 aa ghrelin mimetic',
  aminoAcidCount: 35,
  category: 'GH Secretagogue',
  evidenceLevel: 'Animal Studies + Community Data',
  mechanism: 'CJC-1295 is a GHRH analog that stimulates GH release via pituitary GHRH receptors. Ipamorelin is a ghrelin receptor agonist that stimulates GH release through an entirely separate pathway. Together, they produce synergistic GH pulses with minimal side effects.',
  commonDoseRange: 'CJC-1295: 100–300 mcg; Ipamorelin: 100–300 mcg',
  frequency: '2–3× daily (morning, post-workout, before bed)',
  routeOfAdministration: ['subcutaneous'],
  cycleLength: '12 weeks on, 4–8 weeks off',
  halfLife: 'CJC-1295 with DAC: 6–8 days; CJC-1295 no DAC: ~30 minutes; Ipamorelin: ~2 hours',
  bioavailability: 'Subcutaneous: high. Oral: negligible.',
  reconstitution: 'Reconstitute each peptide separately with bacteriostatic water. Typical: 2 mg vial + 2 ml water = 1 mg/ml.',
  storage: 'Lyophilized: freeze at -20°C for 24 months. Reconstituted: refrigerate at 2–8°C for 28 days.',
  commonSideEffects: ['mild water retention', 'increased hunger (mild)', 'injection site reactions', 'transient numbness/tingling'],
  seriousSideEffects: ['elevated blood glucose/insulin resistance', 'carpal tunnel syndrome (rare)', 'theoretical cancer concern'],
  contraindications: ['active cancer', 'diabetic retinopathy with recent worsening', 'pregnancy', 'breastfeeding', 'uncontrolled diabetes'],
  drugInteractions: ['corticosteroids (may blunt GH response)', 'thyroid medications (monitor levels)', 'insulin (may require adjustment)'],
  pregnancyCategory: 'Contraindicated',
  sahpraStatus: 'Not Registered',
  saAvailability: 'Compounding pharmacy with prescription',
  saPricing: 'R1,000–R1,800/month for the stack',
  registeredProducts: [],
  compoundingStatus: 'Available via compounding with prescription',
}

const keyStudies = [
  {
    title: 'Prolonged stimulation of growth hormone by CJC-1295 in healthy adults',
    authors: 'Teichman SL, et al.',
    journal: 'Journal of Clinical Endocrinology & Metabolism',
    year: 2006,
    doi: '10.1210/jc.2005-2326',
    studyType: 'Phase 1 (Human)',
    participants: 'Healthy adults',
    keyFindings: 'CJC-1295 increased GH and IGF-1 levels with sustained elevation.',
  },
]

const faqs = [
  {
    question: 'How long does CJC-1295 + Ipamorelin take to work?',
    answer: 'Sleep and recovery improvements may be noticed within 1–2 weeks. Body composition changes typically take 8–12 weeks with consistent training and nutrition.',
  },
  {
    question: 'Should I use CJC-1295 with DAC or without DAC?',
    answer: 'CJC-1295 with DAC has a much longer half-life (6–8 days) and produces sustained GH elevation. CJC-1295 without DAC (Mod GRF 1-29) has a short half-life (~30 minutes) and produces more physiological pulsatile GH release.',
  },
  {
    question: 'Will CJC-1295 + Ipamorelin raise my IGF-1?',
    answer: 'Yes, elevated GH leads to increased IGF-1. This is expected and is part of the mechanism. IGF-1 should be monitored periodically.',
  },
  {
    question: 'Can I use this stack if I am diabetic?',
    answer: 'GH secretagogues can raise blood glucose and insulin resistance. Use with caution in diabetics and only under close physician supervision.',
  },
  {
    question: 'Do I need to cycle CJC-1295 + Ipamorelin?',
    answer: 'Yes. Common cycles are 12 weeks on, 4–8 weeks off. This helps prevent receptor desensitization.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-dark-100">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left">
        <span className="font-semibold text-dark-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-dark-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-dark-500 leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  )
}

export default function CJC1295IpamorelinPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-dark-900">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-950 opacity-90" />
        <div className="container-main relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm font-medium mb-4">
                <FlaskConical className="w-4 h-4" />
                {compound.category} | {compound.evidenceLevel}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">{compound.name}</h1>
              <p className="text-lg text-dark-300 leading-relaxed mb-6">
                The most popular GH secretagogue combination, producing synergistic growth hormone pulses for body recomposition, recovery, and sleep quality. Stimulates your pituitary to release its own GH in a pulsatile pattern.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {compound.synonyms.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-dark-800 text-dark-300 text-xs border border-dark-700">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/assessment?compound=cjc-1295-ipamorelin" className="btn-primary">
                  Add to Your Protocol
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/peptide-database" className="btn-ghost">
                  View All Compounds
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection className="hidden lg:block">
              <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><div className="text-dark-400 text-xs">CAS Number</div><div className="text-white font-medium">{compound.casNumber}</div></div>
                  <div><div className="text-dark-400 text-xs">Molecular Weight</div><div className="text-white font-medium">{compound.molecularWeight}</div></div>
                  <div><div className="text-dark-400 text-xs">Amino Acids</div><div className="text-white font-medium">{compound.aminoAcidCount}</div></div>
                  <div><div className="text-dark-400 text-xs">Half-Life</div><div className="text-white font-medium">{compound.halfLife}</div></div>
                  <div className="col-span-2"><div className="text-dark-400 text-xs">Formula</div><div className="text-white font-medium">{compound.molecularFormula}</div></div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Mechanism</span>
              <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">How CJC-1295 + Ipamorelin Works</h2>
              <p className="text-dark-500 leading-relaxed mb-6">{compound.mechanism}</p>
              <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
                <h3 className="font-semibold text-dark-900 mb-3">Receptor Targets</h3>
                <div className="flex flex-wrap gap-2">
                  {['GHRH receptor', 'ghrelin receptor (GHSR1a)'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Evidence</span>
              <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">Key Clinical Study</h2>
              {keyStudies.map((study) => (
                <div key={study.doi} className="card-hover p-5 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-semibold text-primary-600">{study.studyType} | {study.participants}</span>
                  </div>
                  <h3 className="font-semibold text-dark-900 text-sm mb-1">{study.title}</h3>
                  <p className="text-dark-400 text-xs mb-2">{study.authors} — {study.journal} ({study.year})</p>
                  <p className="text-dark-600 text-sm">{study.keyFindings}</p>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Dosing */}
      <section className="section-padding bg-dark-50">
        <div className="container-main max-w-4xl">
          <AnimatedSection className="text-center mb-10">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Protocol Data</span>
            <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">Dosing & Administration</h2>
          </AnimatedSection>
          <AnimatedSection>
            <div className="bg-white rounded-2xl shadow-sm border border-dark-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-dark-50">
                    <tr><th className="text-left px-6 py-3 font-semibold text-dark-700">Parameter</th><th className="text-left px-6 py-3 font-semibold text-dark-700">Details</th></tr>
                  </thead>
                  <tbody className="divide-y divide-dark-100">
                    <tr><td className="px-6 py-3 text-dark-600 font-medium">Common Dose Range</td><td className="px-6 py-3 text-dark-500">{compound.commonDoseRange}</td></tr>
                    <tr><td className="px-6 py-3 text-dark-600 font-medium">Frequency</td><td className="px-6 py-3 text-dark-500">{compound.frequency}</td></tr>
                    <tr><td className="px-6 py-3 text-dark-600 font-medium">Route</td><td className="px-6 py-3 text-dark-500">{compound.routeOfAdministration.join(', ')}</td></tr>
                    <tr><td className="px-6 py-3 text-dark-600 font-medium">Cycle Length</td><td className="px-6 py-3 text-dark-500">{compound.cycleLength}</td></tr>
                    <tr><td className="px-6 py-3 text-dark-600 font-medium">Half-Life</td><td className="px-6 py-3 text-dark-500">{compound.halfLife}</td></tr>
                    <tr><td className="px-6 py-3 text-dark-600 font-medium">Bioavailability</td><td className="px-6 py-3 text-dark-500">{compound.bioavailability}</td></tr>
                    <tr><td className="px-6 py-3 text-dark-600 font-medium">Reconstitution</td><td className="px-6 py-3 text-dark-500">{compound.reconstitution}</td></tr>
                    <tr><td className="px-6 py-3 text-dark-600 font-medium">Storage</td><td className="px-6 py-3 text-dark-500">{compound.storage}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-red-50 border-t border-red-100">
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>All dosing is individualized and prescribed by an HPCSA-registered physician. Never self-dose. The information above is for educational purposes only.</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Safety */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-10">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Safety</span>
            <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">Side Effects, Contraindications & Interactions</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            <StaggerContainer staggerDelay={0.15}>
              <StaggerItem>
                <div className="card-hover p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Pill className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-dark-900">Common Side Effects</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-dark-500">
                    {compound.commonSideEffects.map((s) => (<li key={s} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />{s}</li>))}
                  </ul>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="card-hover p-6 h-full mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-dark-900">Serious Side Effects</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-dark-500">
                    {compound.seriousSideEffects.map((s) => (<li key={s} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />{s}</li>))}
                  </ul>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="card-hover p-6 h-full mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-dark-900">Contraindications</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-dark-500">
                    {compound.contraindications.map((s) => (<li key={s} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />{s}</li>))}
                  </ul>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
          <AnimatedSection className="mt-8">
            <div className="bg-red-50 rounded-xl p-5 border border-red-100">
              <h3 className="font-semibold text-red-800 mb-2">Drug Interactions</h3>
              <ul className="space-y-1 text-sm text-red-700">
                {compound.drugInteractions.map((s) => (<li key={s}>• {s}</li>))}
              </ul>
              <p className="text-sm text-red-600 mt-3">Pregnancy Category: {compound.pregnancyCategory}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* South African Context */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-10">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">South Africa</span>
            <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">SAHPRA Status, Availability & Pricing</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StaggerContainer staggerDelay={0.15}>
              <StaggerItem>
                <div className="card-hover p-6 h-full">
                  <Globe className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-dark-900 mb-2">SAHPRA Status</h3>
                  <p className="text-sm text-dark-500">{compound.sahpraStatus}</p>
                  <p className="text-sm text-dark-500 mt-2">{compound.saAvailability}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="card-hover p-6 h-full mt-6">
                  <Banknote className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-dark-900 mb-2">Pricing in South Africa</h3>
                  <p className="text-sm text-dark-500">{compound.saPricing}</p>
                  <p className="text-sm text-dark-500 mt-2">{compound.compoundingStatus}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="card-hover p-6 h-full mt-6">
                  <Stethoscope className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-dark-900 mb-2">Medical Aid</h3>
                  <p className="text-sm text-dark-500">Not SAHPRA-registered for GH optimization, so medical aid coverage is limited. Some day-to-day benefits may apply. We provide itemized invoices for reimbursement claims.</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <AnimatedSection className="text-center mb-10">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">CJC-1295 + Ipamorelin Questions</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-2xl shadow-sm border border-dark-100 p-2 md:p-6">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Related */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-bold text-dark-900 mb-4">Related Compounds & Protocols</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link to="/peptides/bpc-157" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">BPC-157</h3>
              <p className="text-sm text-dark-500">Body Protection Compound for tendon, ligament, and gut repair</p>
            </Link>
            <Link to="/peptides/tb-500" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">TB-500</h3>
              <p className="text-sm text-dark-500">Thymosin Beta-4 for cell migration and tissue regeneration</p>
            </Link>
            <Link to="/programs/longevity" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">Longevity Program</h3>
              <p className="text-sm text-dark-500">Biomarker-driven healthspan optimization protocol</p>
            </Link>
            <Link to="/programs/sports-performance" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">Sports Performance Program</h3>
              <p className="text-sm text-dark-500">Periodized performance protocol with recovery optimization</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <FlaskConical className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Add CJC-1295 + Ipamorelin to Your Protocol</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Take our 2-minute assessment and see if this GH secretagogue stack is right for your goals.
            </p>
            <Link to="/assessment?compound=cjc-1295-ipamorelin" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
              Take Your 2-Minute Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
