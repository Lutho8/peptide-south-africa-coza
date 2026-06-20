import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, Stethoscope, Shield, ChevronDown, Hourglass, HeartPulse, Sparkles, FlaskConical, Phone, Dna } from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../../components/pages/AnimatedSection'

const stats = [
  { value: 'Biomarker', label: 'Driven Protocols', icon: Dna },
  { value: '100%', label: 'Physician-Supervised', icon: Stethoscope },
  { value: 'SAHPRA', label: 'Compliant', icon: Shield },
]

const steps = [
  {
    number: '01',
    title: 'Complete Your Assessment',
    description: 'Share your health goals, current biomarkers, lifestyle, and longevity objectives. We screen for contraindications and optimize for your age and healthspan.',
    icon: FlaskConical,
  },
  {
    number: '02',
    title: 'Physician Review & Protocol Design',
    description: 'An HPCSA-registered longevity physician reviews your profile and designs a personalized protocol combining peptides, nutrition, and lifestyle optimization.',
    icon: Stethoscope,
  },
  {
    number: '03',
    title: 'Ongoing Optimization & Monitoring',
    description: 'Monthly biomarker reviews, quarterly epigenetic panels, and protocol adjustments ensure your longevity stack evolves with your biology.',
    icon: HeartPulse,
  },
]

const faqs = [
  {
    question: 'What is the Longevity program?',
    answer: 'Our Longevity program is a comprehensive healthspan optimization protocol combining peptide therapy (NAD+, CJC-1295/Ipamorelin, Epitalon, MOTS-C) with biomarker monitoring, nutritional guidance, and lifestyle coaching. It is designed for patients who want to slow aging and optimize cellular function.',
  },
  {
    question: 'What peptides are used in the Longevity program?',
    answer: 'Depending on your biomarkers and goals, your physician may recommend NAD+ for cellular energy, CJC-1295 + Ipamorelin for growth hormone optimization, Epitalon for telomerase support, MOTS-C for mitochondrial function, or GHK-Cu for tissue repair. Every protocol is individualized.',
  },
  {
    question: 'How long before I notice results?',
    answer: 'Sleep and energy improvements may be noticed within 2-4 weeks. Body composition and skin changes typically take 8-12 weeks. Biomarker improvements (IGF-1, NAD+ levels, inflammatory markers) are measurable at 3 months. Longevity is a lifelong commitment, not a quick fix.',
  },
  {
    question: 'Do I need bloodwork before starting?',
    answer: 'Yes. We recommend a baseline longevity panel including IGF-1, NAD+ levels, inflammatory markers (CRP, IL-6), lipid panel, thyroid function, and hormonal profile. Some panels are included in your first month; others may require you to provide recent results.',
  },
  {
    question: 'Is the Longevity program safe long-term?',
    answer: 'When prescribed and monitored by qualified physicians, longevity peptides have a strong safety profile. We monitor IGF-1, glucose, and inflammatory markers quarterly to ensure your protocol remains safe and effective. Cycles and dosing are adjusted based on your biomarkers.',
  },
  {
    question: 'Can I combine Longevity with Weight Loss?',
    answer: 'Yes, many patients stack longevity and metabolic goals. For example, semaglutide for weight management combined with NAD+ and MOTS-C for cellular health. Your physician will design a safe, synergistic stack.',
  },
  {
    question: 'What does the program cost?',
    answer: 'The Longevity program is R2,800/month. This includes the advanced biomarker panel, physician consultation, compounded medication, quarterly reviews, and app access.',
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

export default function LongevityProgram() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-dark-900">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-accent-950 opacity-90" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="container-main relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/15 border border-accent-500/20 text-accent-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Physician-Supervised Protocol
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Optimize Your<br />
                <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                  Healthspan & Longevity
                </span>
              </h1>
              <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
                Biomarker-driven peptide protocols designed to slow aging, enhance cellular function, and extend your healthspan. Personalized by HPCSA-registered longevity physicians.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/assessment?program=longevity" className="btn-primary">
                  Start Your Program
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/pricing" className="btn-ghost">
                  View Pricing
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection className="hidden lg:block">
              <div className="w-full max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-accent-500/20 to-primary-500/20 p-8 border border-white/10">
                <div className="text-center">
                  <Hourglass className="w-16 h-16 text-accent-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">R2,800/month</h3>
                  <p className="text-dark-400 text-sm mb-4">Includes advanced biomarker panel, physician consultation, medication, and quarterly reviews</p>
                  <div className="space-y-2 text-sm text-dark-300">
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-accent-400" />Longevity biomarker panel</div>
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-accent-400" />Skin & sleep optimization</div>
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-accent-400" />Epigenetic testing option</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-dark-100" ref={statsRef}>
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark-100">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-4 py-8 md:py-10 px-6 md:px-8"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-primary-100 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-dark-900">{stat.value}</div>
                  <div className="text-sm text-dark-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Overview */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Protocol Overview</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">What You Get</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">A comprehensive longevity protocol combining peptide therapy with biomarker monitoring and lifestyle optimization.</p>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-4">
                  <FlaskConical className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Primary Compounds</h3>
                <p className="text-dark-500 text-sm leading-relaxed">NAD+, CJC-1295 + Ipamorelin, Epitalon, MOTS-C, or GHK-Cu depending on your biomarkers and goals. Each compound targets specific aging pathways.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <Hourglass className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Expected Timeline</h3>
                <p className="text-dark-500 text-sm leading-relaxed">Energy and sleep improvements in 2-4 weeks. Body composition and skin changes at 8-12 weeks. Biomarker improvements measurable at 3 months. Long-term protocols are ongoing with quarterly reviews.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Medical Oversight</h3>
                <p className="text-dark-500 text-sm leading-relaxed">Monthly biomarker reviews, quarterly epigenetic panels, and personalized protocol adjustments. Your physician monitors IGF-1, NAD+ levels, and inflammatory markers continuously.</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Your Longevity Journey</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">A data-driven approach to extending your healthspan.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-accent-200 to-primary-200" />
            <StaggerContainer className="contents" staggerDelay={0.2}>
              {steps.map((step) => (
                <StaggerItem key={step.number}>
                  <div className="relative text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/25">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-sm font-bold text-accent-600 mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold text-dark-900 mb-3">{step.title}</h3>
                    <p className="text-dark-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Medical Oversight */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Safety First</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">HPCSA-Registered Physician Oversight</h2>
              <p className="text-dark-500 leading-relaxed mb-6">
                Every longevity protocol is prescribed by an HPCSA-registered physician with specialized training in peptide therapy and metabolic medicine. We review your full medical history, current biomarkers, and contraindications before designing your personalized protocol.
              </p>
              <ul className="space-y-3">
                {[
                  'Complete medical history and biomarker review',
                  'Contraindication screening (cancer history, uncontrolled diabetes)',
                  'IGF-1 and glucose monitoring for GH secretagogues',
                  'Quarterly biomarker panels and protocol adjustments',
                  'Dose cycling to prevent receptor desensitization',
                  'Personalized nutrition and lifestyle recommendations',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-dark-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection>
              <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl p-8 border border-accent-100">
                <h3 className="text-xl font-bold text-dark-900 mb-4">Why Biomarker Monitoring Matters</h3>
                <p className="text-dark-500 text-sm leading-relaxed mb-4">
                  Longevity peptides affect cellular pathways that are measurable. Without biomarker tracking, you are guessing. Peptide South Africa provides quarterly panels to ensure your protocol is producing the desired biological effects and remains safe.
                </p>
                <div className="bg-white rounded-xl p-4 border border-dark-100">
                  <div className="text-sm font-semibold text-dark-900 mb-2">Typical Monitoring Panel</div>
                  <div className="text-sm text-dark-500 space-y-1">
                    <div>IGF-1 (GH pathway activity)</div>
                    <div>NAD+ levels (cellular energy)</div>
                    <div>hs-CRP & IL-6 (inflammation)</div>
                    <div>Lipid panel & HbA1c (metabolic health)</div>
                    <div className="text-xs text-dark-400 pt-2">Panel is individualized by your physician</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-dark-900">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Longevity Program</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">Transparent pricing. No hidden fees. Everything you need for healthspan optimization.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <AnimatedSection className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="text-sm text-dark-400 mb-2">Monthly</div>
              <div className="text-3xl font-bold text-white mb-4">R2,800<span className="text-lg text-dark-400 font-normal">/month</span></div>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>Physician consultation</li>
                <li>Longevity biomarker panel</li>
                <li>Prescription & compounding</li>
                <li>Cold-chain delivery</li>
                <li>Monthly reviews</li>
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="bg-gradient-to-br from-accent-600 to-accent-800 rounded-2xl p-6 border border-accent-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">Best Value</div>
              <div className="text-sm text-accent-200 mb-2">3-Month Prepay (Save 10%)</div>
              <div className="text-3xl font-bold text-white mb-4">R7,560</div>
              <ul className="space-y-2 text-sm text-accent-100">
                <li>Everything in Monthly</li>
                <li>Skin protocol included</li>
                <li>Sleep optimization</li>
                <li>Save R840</li>
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="text-sm text-dark-400 mb-2">6-Month Prepay (Save 15%)</div>
              <div className="text-3xl font-bold text-white mb-4">R14,280</div>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>Everything in 3-Month</li>
                <li>Epigenetic testing option</li>
                <li>Priority physician access</li>
                <li>Save R2,520</li>
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-dark-50">
        <div className="container-main max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Longevity Questions</h2>
            <p className="text-dark-500">Everything you need to know about our longevity protocols.</p>
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

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-accent-600 to-primary-800">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <Hourglass className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Invest in Your Longevity</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Take our 2-minute assessment and discover how peptide therapy can optimize your cellular health and extend your healthspan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment?program=longevity" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
                Take Your 2-Minute Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact-us" className="btn-ghost">
                <Phone className="w-4 h-4" />
                Speak to a Physician
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
