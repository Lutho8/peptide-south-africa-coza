import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, Stethoscope, Shield, ChevronDown, FlaskConical, AlertTriangle, Pill, BookOpen, Globe, Banknote } from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../../components/pages/AnimatedSection'

const compound = {
  name: 'TB-500',
  synonyms: ['Thymosin Beta-4', 'Thymosin β4', 'TB4'],
  casNumber: '77591-33-4',
  molecularFormula: 'C212H350N56O78S',
  molecularWeight: '4963.5 g/mol',
  aminoAcidSequence: '43 amino acid sequence (full Thymosin Beta-4)',
  aminoAcidCount: 43,
  category: 'Healing & Recovery',
  evidenceLevel: 'Animal Studies + Limited Human Data',
  mechanism: 'TB-500 is the active fragment of Thymosin Beta-4. It regulates actin polymerization, promotes cell migration to wound sites, and reduces inflammatory cytokines.',
  commonDoseRange: '2–5 mg twice weekly',
  frequency: 'Twice weekly',
  routeOfAdministration: ['subcutaneous', 'intramuscular'],
  cycleLength: '4–6 weeks for acute; 8–12 weeks for maintenance',
  halfLife: 'Approximately 10–14 days (long-acting)',
  bioavailability: 'Subcutaneous preferred; oral bioavailability very low',
  reconstitution: 'Reconstitute with 1–2 ml bacteriostatic water. Subcutaneous injection.',
  storage: 'Lyophilized: freeze at -20°C for 24 months. Reconstituted: refrigerate at 2–8°C for 28 days.',
  commonSideEffects: ['mild injection site reaction', 'headache', 'fatigue'],
  seriousSideEffects: ['Theoretical cancer concern (no clinical evidence)'],
  contraindications: ['active cancer (theoretical)', 'pregnancy', 'breastfeeding'],
  drugInteractions: ['Few known'],
  pregnancyCategory: 'Contraindicated',
  sahpraStatus: 'Not Registered',
  saAvailability: 'Compounding pharmacy with prescription',
  saPricing: 'R1,000–R1,500/month',
  registeredProducts: [],
  compoundingStatus: 'Available via licensed compounding with prescription',
}

const keyStudies = [
  {
    title: 'Thymosin beta4 promotes wound healing and angiogenesis',
    authors: 'Malinda KM, et al.',
    journal: 'FASEB Journal',
    year: 1999,
    doi: '10.1096/fasebj.13.15.1784',
    studyType: 'Animal / In Vitro',
    participants: 'Cell and animal models',
    keyFindings: 'TB-500 accelerated wound healing and promoted angiogenesis in animal models.',
  },
]

const faqs = [
  {
    question: 'How often should I take TB-500?',
    answer: 'Typical dosing is 2–5 mg twice weekly due to its long half-life. Some protocols use a loading phase of daily dosing for 1–2 weeks, then transition to twice weekly.',
  },
  {
    question: 'Can I combine TB-500 with BPC-157?',
    answer: 'Yes, they are frequently used together. BPC-157 targets growth factor signaling and angiogenesis, while TB-500 promotes cell migration and actin regulation.',
  },
  {
    question: 'How long does TB-500 stay in the body?',
    answer: 'The half-life is approximately 10–14 days, meaning it remains active for several weeks after the last dose.',
  },
  {
    question: 'Is TB-500 safe for long-term use?',
    answer: 'Long-term safety data in humans is limited. Most protocols use cycles of 4–12 weeks. Discuss long-term use with your physician.',
  },
  {
    question: 'Do I need a prescription for TB-500 in South Africa?',
    answer: 'Yes. TB-500 is not SAHPRA-registered and requires a prescription from an HPCSA-registered physician for compounding.',
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

export default function TB500Page() {
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
                A healing peptide that promotes cell migration, angiogenesis, and tissue regeneration. Long half-life allows for infrequent dosing. Commonly used alongside BPC-157 in recovery protocols.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {compound.synonyms.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-dark-800 text-dark-300 text-xs border border-dark-700">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/assessment?compound=tb-500" className="btn-primary">
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
              <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">How TB-500 Works</h2>
              <p className="text-dark-500 leading-relaxed mb-6">{compound.mechanism}</p>
              <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
                <h3 className="font-semibold text-dark-900 mb-3">Receptor Targets</h3>
                <div className="flex flex-wrap gap-2">
                  {['actin cytoskeleton', 'integrin receptors'].map((t) => (
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
                  <p className="text-sm text-dark-500">Not SAHPRA-registered for healing indications, so medical aid coverage is limited. Some day-to-day benefits may apply. We provide itemized invoices for reimbursement claims.</p>
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
            <h2 className="text-3xl font-bold text-dark-900 mt-2 mb-4">TB-500 Questions</h2>
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
            <Link to="/peptides/cjc-1295-ipamorelin" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">CJC-1295 + Ipamorelin</h3>
              <p className="text-sm text-dark-500">GH secretagogue stack for recovery and body recomposition</p>
            </Link>
            <Link to="/programs/muscle-recovery" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">Muscle Recovery Program</h3>
              <p className="text-sm text-dark-500">Full physician-guided recovery protocol with physio coordination</p>
            </Link>
            <Link to="/programs/sports-performance" className="card-hover p-6 block">
              <h3 className="font-semibold text-dark-900 mb-1">Sports Performance Program</h3>
              <p className="text-sm text-dark-500">Periodized performance protocol with injury prevention</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <FlaskConical className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Add TB-500 to Your Protocol</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Take our 2-minute assessment and see if TB-500 is right for your recovery or healing goals.
            </p>
            <Link to="/assessment?compound=tb-500" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
              Take Your 2-Minute Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
