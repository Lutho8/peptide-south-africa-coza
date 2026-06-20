import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, Stethoscope, Shield, ChevronDown, TrendingDown, HeartPulse, Sparkles, FlaskConical, Phone, Scale } from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../../components/pages/AnimatedSection'

const stats = [
  { value: '15-22%', label: 'Average Weight Loss', icon: TrendingDown },
  { value: '100%', label: 'Physician-Supervised', icon: Stethoscope },
  { value: 'SAHPRA', label: 'Compliant', icon: Shield },
]

const steps = [
  {
    number: '01',
    title: 'Complete Your Assessment',
    description: 'Start with a thorough medical questionnaire covering your health history, weight-loss goals, and lifestyle. Our physicians review every submission personally.',
    icon: FlaskConical,
  },
  {
    number: '02',
    title: 'Physician Review & Protocol',
    description: 'A licensed South African physician evaluates your case and designs a personalized GLP-1 protocol tailored to your body, goals, and medical history.',
    icon: Stethoscope,
  },
  {
    number: '03',
    title: 'Begin Your Journey',
    description: 'Your medication is compounded at a SAHPRA-compliant pharmacy and delivered to your door. Ongoing monitoring and dose adjustments ensure optimal results.',
    icon: HeartPulse,
  },
]

const faqs = [
  {
    question: 'How quickly will I see results with GLP-1 peptides?',
    answer: 'Most patients notice appetite suppression within the first 1-2 weeks. Visible weight loss typically begins around week 3-4, with an average of 15-22% total body weight reduction over 6-12 months. Individual results vary based on adherence, starting weight, and lifestyle factors.',
  },
  {
    question: 'Are these peptides safe?',
    answer: 'Yes. All protocols are prescribed by licensed South African physicians after reviewing your full medical history. The medications are compounded at SAHPRA-compliant pharmacies with rigorous quality controls. Side effects are typically mild and transient, and your physician monitors you throughout.',
  },
  {
    question: 'What is the difference between Tirzepatide and Semaglutide?',
    answer: 'Tirzepatide is a dual agonist that targets both GLP-1 and GIP receptors, which may produce greater weight loss and metabolic benefits. Semaglutide is a GLP-1 agonist with extensive clinical data and proven efficacy. Your physician will recommend the best option based on your profile.',
  },
  {
    question: 'Do I need to visit a clinic in person?',
    answer: 'No. Our entire process is telehealth-based. You complete the questionnaire online, a physician reviews it remotely, and your medication is delivered directly to your door. Follow-ups are conducted via secure messaging or video call.',
  },
  {
    question: 'What does the protocol cost?',
    answer: 'The Weight Loss program is R2,400/month. Pricing includes physician consultation, prescription, compounded medication, cold-chain delivery, and ongoing support. Visit our Pricing page for a full breakdown.',
  },
  {
    question: 'How long do I need to stay on the protocol?',
    answer: 'For weight loss, 12-16 weeks is typical for active loss, followed by a maintenance protocol. Your physician will recommend a timeline based on your goals and response.',
  },
  {
    question: 'Can I switch to a different program later?',
    answer: 'Yes. If your goals change, your physician can redesign your protocol at your monthly check-in. Program changes are reviewed for safety and may require additional bloodwork.',
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

export default function WeightLossProgram() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-dark-900">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-950 opacity-90" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="container-main relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Physician-Supervised Protocol
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Science-Backed<br />
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Weight Loss Program
                </span>
              </h1>
              <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
                Physician-supervised GLP-1 peptide therapy designed for the South African body. 
                Personalized, safe, and proven to deliver 15-22% average weight loss.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/assessment?program=weight-loss" className="btn-primary">
                  Start Your Program
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/pricing" className="btn-ghost">
                  View Pricing
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection className="hidden lg:block">
              <div className="w-full max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 p-8 border border-white/10">
                <div className="text-center">
                  <Scale className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">R2,400/month</h3>
                  <p className="text-dark-400 text-sm mb-4">Includes physician consultation, prescription, medication, and ongoing support</p>
                  <div className="space-y-2 text-sm text-dark-300">
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-primary-400" />HPCSA-registered physician</div>
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-primary-400" />SAPC-registered pharmacy</div>
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-primary-400" />Weekly check-ins included</div>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-600" />
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
            <p className="text-dark-500 max-w-2xl mx-auto">A comprehensive weight-loss protocol combining GLP-1 peptide therapy with physician oversight and lifestyle support.</p>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <FlaskConical className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Primary Compounds</h3>
                <p className="text-dark-500 text-sm leading-relaxed">Semaglutide or Tirzepatide (GLP-1/GIP agonists) to reduce appetite, slow gastric emptying, and improve insulin sensitivity. Your physician selects the best option for your profile.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Expected Timeline</h3>
                <p className="text-dark-500 text-sm leading-relaxed">Appetite suppression begins within days. Visible weight loss typically starts at 4-8 weeks. Peak results at 6-12 months. Average 15-22% total body weight reduction.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Medical Oversight</h3>
                <p className="text-dark-500 text-sm leading-relaxed">Weekly check-ins (Month 1), bi-weekly (Months 2-3), then monthly. Dose titration, side-effect management, and biomarker monitoring included.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Your 3-Step Weight Loss Journey</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">A streamlined process designed to get you from assessment to results safely and efficiently.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-300" />
            <StaggerContainer className="contents" staggerDelay={0.2}>
              {steps.map((step) => (
                <StaggerItem key={step.number}>
                  <div className="relative text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-sm font-bold text-primary-600 mb-2">{step.number}</div>
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
                Every weight-loss protocol is prescribed by an HPCSA-registered physician who reviews your full medical history, current medications, and contraindications. We screen for pancreatitis history, thyroid cancer risk, pregnancy, and drug interactions before prescribing any GLP-1 agonist.
              </p>
              <ul className="space-y-3">
                {[
                  'Complete medical history review before prescribing',
                  'Contraindication screening (pancreatitis, MTC/MEN2, pregnancy)',
                  'Dose titration starting low to minimize GI side effects',
                  'Weekly check-ins with side-effect monitoring',
                  'Biomarker tracking (HbA1c, lipids, liver function)',
                  'Dose adjustments included at no extra cost',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-dark-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection>
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 border border-primary-100">
                <h3 className="text-xl font-bold text-dark-900 mb-4">Why Physician Supervision Matters</h3>
                <p className="text-dark-500 text-sm leading-relaxed mb-4">
                  GLP-1 agonists are powerful medications. Self-sourcing from unregulated websites puts you at risk of counterfeit products, incorrect dosing, and no medical support if side effects occur. Peptide South Africa ensures you receive genuine, compounded medication with a qualified physician monitoring your progress.
                </p>
                <div className="bg-white rounded-xl p-4 border border-dark-100">
                  <div className="text-sm font-semibold text-dark-900 mb-2">Typical Starting Protocol</div>
                  <div className="text-sm text-dark-500 space-y-1">
                    <div>Semaglutide: 0.25 mg weekly (Week 1-4)</div>
                    <div>Titration: 0.5 mg weekly (Week 5-8)</div>
                    <div>Maintenance: 1.0 mg weekly (Week 9+)</div>
                    <div className="text-xs text-dark-400 pt-2">Dosing is individualized by your physician</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Weight Loss Program</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">Transparent pricing. No hidden fees. Everything you need for safe, effective weight loss.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <AnimatedSection className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="text-sm text-dark-400 mb-2">Monthly</div>
              <div className="text-3xl font-bold text-white mb-4">R2,400<span className="text-lg text-dark-400 font-normal">/month</span></div>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>Physician consultation</li>
                <li>Prescription & compounding</li>
                <li>Cold-chain delivery</li>
                <li>Weekly check-ins</li>
                <li>App access</li>
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 border border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">Best Value</div>
              <div className="text-sm text-primary-200 mb-2">3-Month Prepay (Save 10%)</div>
              <div className="text-3xl font-bold text-white mb-4">R6,480</div>
              <ul className="space-y-2 text-sm text-primary-100">
                <li>Everything in Monthly</li>
                <li>Nutritionist framework</li>
                <li>Movement protocol</li>
                <li>Body composition tracking</li>
                <li>Save R720</li>
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="text-sm text-dark-400 mb-2">6-Month Prepay (Save 15%)</div>
              <div className="text-3xl font-bold text-white mb-4">R12,240</div>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>Everything in 3-Month</li>
                <li>Quarterly biomarker panel</li>
                <li>Priority physician access</li>
                <li>Save R2,160</li>
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
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Weight Loss Questions</h2>
            <p className="text-dark-500">Everything you need to know about our GLP-1 protocols.</p>
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
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <Scale className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Weight Loss Journey</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Join hundreds of South Africans who have taken control of their weight with physician-supervised peptide therapy. Your assessment takes just 2 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment?program=weight-loss" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
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
