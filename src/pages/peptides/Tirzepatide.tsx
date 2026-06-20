import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, Stethoscope, Shield, ChevronDown, FlaskConical, AlertTriangle, Pill, BookOpen, Globe, Banknote } from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../../components/pages/AnimatedSection'

const compound = {
  name: 'Tirzepatide',
  synonyms: ['Dual GIP/GLP-1 receptor agonist', 'Mounjaro', 'Zepbound'],
  casNumber: '2023788-19-2',
  molecularFormula: 'C225H348N56O68',
  molecularWeight: '4813.5 g/mol',
  aminoAcidSequence: '39 amino acid linear peptide with C20 fatty di-acid moiety',
  aminoAcidCount: 39,
  category: 'Metabolic',
  evidenceLevel: 'Phase 3 RCT (Large-Scale)',
  mechanism: 'Tirzepatide is a dual agonist that activates both GLP-1 and GIP receptors. GLP-1 reduces appetite and slows gastric emptying. GIP enhances the GLP-1 effect and may have independent effects on adipose tissue.',
  commonDoseRange: '2.5 mg weekly (start) → 5, 10, 15 mg weekly (maintenance)',
  frequency: 'Weekly',
  routeOfAdministration: ['subcutaneous'],
  cycleLength: 'Indefinite for diabetes; 72+ weeks for weight loss',
  halfLife: 'Approximately 5 days for tirzepatide; 116 hours for main metabolite',
  bioavailability: 'Subcutaneous: ~80%',
  reconstitution: 'Mounjaro is pre-filled single-dose pen. No reconstitution. Compounded tirzepatide requires reconstitution.',
  storage: 'Refrigerate at 2–8°C. Do not freeze.',
  commonSideEffects: ['nausea (40–50%)', 'diarrhea (20–30%)', 'vomiting (15–20%)', 'constipation (10–15%)', 'decreased appetite (80–90%)'],
  seriousSideEffects: ['pancreatitis', 'gallbladder disease', 'acute kidney injury', 'hypoglycemia (with insulin/sulfonylureas)'],
  contraindications: ['MTC/MEN2 history', 'pancreatitis history', 'pregnancy', 'breastfeeding', 'severe GI disease', 'eating disorder'],
  drugInteractions: ['insulin/sulfonylureas', 'warfarin', 'oral medications'],
  pregnancyCategory: 'Contraindicated',
  sahpraStatus: 'Registered for T2D (Mounjaro). Weight-loss indication pending.',
  saAvailability: 'Mounjaro launched Dec 2024 by Aspen. Available at licensed pharmacies.',
  saPricing: 'Mounjaro: R880–R4,600/month (dose-dependent). Compounded: R2,000–R3,500/month.',
  registeredProducts: ['Mounjaro (Eli Lilly / Aspen)'],
  compoundingStatus: 'Compounded tirzepatide available via telehealth platforms',
}

const keyStudies = [
  {
    title: 'Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1)',
    authors: 'Jastreboff AM, et al.',
    journal: 'New England Journal of Medicine',
    year: 2022,
    doi: '10.1056/NEJMoa2206038',
    studyType: 'RCT',
    participants: '2,539 adults',
    keyFindings: '20.9% average weight loss at 15 mg over 72 weeks. Superior to semaglutide in head-to-head trial.',
  },
]

const faqs = [
  {
    question: 'Is tirzepatide better than semaglutide?',
    answer: 'Clinical evidence suggests yes. Tirzepatide produced 20.9% average weight loss vs. 14.9% for semaglutide. However, tirzepatide has slightly higher GI side effects.',
  },
  {
    question: 'When will Mounjaro be approved for weight loss in South Africa?',
    answer: 'Eli Lilly has submitted an application to SAHPRA for a weight-loss indication. It is pending review as of June 2026.',
  },
  {
    question: 'How much does Mounjaro cost in South Africa?',
    answer: 'Single-dose pens range from R880 (2.5/5 mg) to R1,140 (10 mg). A month of 10 mg maintenance costs approximately R4,600.',
  },
  {
    question: 'Can I switch from semaglutide to tirzepatide?',
    answer: 'Yes, under physician supervision. The switch requires a new titration schedule starting at a low dose.',
  },
  {
    question: 'Does medical aid cover Mounjaro?',
    answer: 'For T2D: covered under Chronic Illness Benefit by Discovery and Momentum when criteria are met. For weight loss: day-to-day benefits only.',
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

export default function TirzepatidePage() {
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
                The most effective GLP-1-based weight loss medication, with 20.9% average weight loss in Phase 3 trials. The dual GLP-1/GIP mechanism outperforms semaglutide head-to-head.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {compound.synonyms.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-dark-800 text-dark-300 text-xs border border-dark-700">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/assessment?compound=tirzepatide" className="btn-primary">
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
              <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">How Tirzepatide Works</h2>
              <p className="text-dark-500 leading-relaxed mb-6">{compound.mechanism}</p>
              <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
                <h3 className="font-semibold text-dark-900 mb-3">Receptor Targets</h3>
                <div className="flex flex-wrap gap-2">
                  {['GLP-1 receptor', 'GIP receptor'].map((t) => (
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
                  <p className="text-sm text-dark-500">For T2D: covered under Chronic Illness Benefit by Discovery and Momentum when criteria are met. For weight loss: day-to-day benefits only.</p>
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
            <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">Tirzepatide Questions</h2>
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
            <Link to="/peptides/semaglutide" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">Semaglutide</h3>
              <p className="text-sm text-dark-500">GLP-1 agonist with proven efficacy and better GI tolerance for some patients</p>
            </Link>
            <Link to="/peptides/cjc-1295-ipamorelin" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">CJC-1295 + Ipamorelin</h3>
              <p className="text-sm text-dark-500">GH secretagogue stack for body recomposition and recovery</p>
            </Link>
            <Link to="/programs/weight-loss" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">Weight Loss Program</h3>
              <p className="text-sm text-dark-500">Full physician-guided weight loss protocol</p>
            </Link>
            <Link to="/programs/metabolic-reset" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">Metabolic Reset Program</h3>
              <p className="text-sm text-dark-500">Insulin sensitivity and metabolic health protocol</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <FlaskConical className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Add Tirzepatide to Your Protocol</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Take our 2-minute assessment and see if tirzepatide is right for your weight loss or metabolic goals.
            </p>
            <Link to="/assessment?compound=tirzepatide" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
              Take Your 2-Minute Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
