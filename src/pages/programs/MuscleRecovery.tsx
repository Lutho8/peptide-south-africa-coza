import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, Stethoscope, Shield, ChevronDown, Dumbbell, HeartPulse, Sparkles, FlaskConical, Phone, Heart } from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../../components/pages/AnimatedSection'

const stats = [
  { value: '50%', label: 'Faster Recovery', icon: HeartPulse },
  { value: '100%', label: 'Physician-Supervised', icon: Stethoscope },
  { value: 'SAHPRA', label: 'Compliant', icon: Shield },
]

const steps = [
  {
    number: '01',
    title: 'Complete Your Assessment',
    description: 'Share your injury history, surgery details, current training load, and recovery goals. We screen for contraindications and optimize for tissue repair.',
    icon: FlaskConical,
  },
  {
    number: '02',
    title: 'Physician Review & Healing Protocol',
    description: 'An HPCSA-registered sports medicine physician designs a personalized recovery protocol using healing peptides and physiotherapy coordination.',
    icon: Stethoscope,
  },
  {
    number: '03',
    title: 'Recover, Rehab & Return',
    description: 'Your medication is compounded and delivered. Physiotherapy coordination, imaging reviews, and return-to-sport protocols ensure complete recovery.',
    icon: HeartPulse,
  },
]

const faqs = [
  {
    question: 'What is the Muscle Recovery program?',
    answer: 'The Muscle Recovery program is designed for athletes, fitness enthusiasts, and patients recovering from injury or surgery. It uses healing peptides like BPC-157 and TB-500 to accelerate tissue repair, reduce inflammation, and speed return-to-sport.',
  },
  {
    question: 'What peptides are used?',
    answer: 'BPC-157 for tendon, ligament, and muscle repair. TB-500 for cell migration and tissue regeneration. GHK-Cu may be added for skin and wound healing. Your physician selects the optimal stack based on your injury type and recovery timeline.',
  },
  {
    question: 'How long before I see results?',
    answer: 'Pain reduction is typically reported within 1-2 weeks. Functional improvement and tissue healing progress over 4-8 weeks. Full recovery from serious injuries may take 12-16 weeks with consistent peptide therapy and physiotherapy.',
  },
  {
    question: 'Can I train while on the recovery protocol?',
    answer: 'Yes, but with modifications. Your physician and physiotherapist will guide training load based on your healing stage. For acute injuries, relative rest is recommended in the first 2-4 weeks. For chronic issues, training can often continue with adjusted volume.',
  },
  {
    question: 'Do I need imaging before starting?',
    answer: 'For serious injuries (tendon tears, ligament ruptures), recent imaging (MRI, ultrasound) is strongly recommended. For minor strains and chronic overuse, a clinical assessment by your physician may be sufficient.',
  },
  {
    question: 'Is this for post-surgical recovery?',
    answer: 'Yes. BPC-157 and TB-500 are commonly used for post-surgical tissue repair. Your physician will coordinate with your surgeon to ensure the protocol is appropriate for your specific surgery and recovery timeline.',
  },
  {
    question: 'What is the cost?',
    answer: 'The Muscle Recovery program is R2,600/month. This includes physio coordination, injury-specific dosing, imaging review, and return-to-sport protocol design.',
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

export default function MuscleRecoveryProgram() {
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
                Accelerate<br />
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Muscle Recovery
                </span>
              </h1>
              <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
                Healing peptide protocols for injury recovery, post-surgical repair, and tissue regeneration. Designed by sports medicine physicians and coordinated with your physiotherapist.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/assessment?program=muscle-recovery" className="btn-primary">
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
                  <Dumbbell className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">R2,600/month</h3>
                  <p className="text-dark-400 text-sm mb-4">Includes physio coordination, injury dosing, imaging review, and return-to-sport protocol</p>
                  <div className="space-y-2 text-sm text-dark-300">
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-primary-400" />Sports medicine physician</div>
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-primary-400" />Physio coordination</div>
                    <div className="flex items-center gap-2 justify-center"><Shield className="w-4 h-4 text-primary-400" />Return-to-sport protocol</div>
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
            <p className="text-dark-500 max-w-2xl mx-auto">A comprehensive recovery protocol combining healing peptides with physiotherapy coordination and return-to-sport planning.</p>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <FlaskConical className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Primary Compounds</h3>
                <p className="text-dark-500 text-sm leading-relaxed">BPC-157 for tendon, ligament, and muscle repair. TB-500 for cell migration and tissue regeneration. GHK-Cu may be added for skin and wound healing.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Expected Timeline</h3>
                <p className="text-dark-500 text-sm leading-relaxed">Pain reduction in 1-2 weeks. Functional improvement at 4-8 weeks. Full recovery from serious injuries in 12-16 weeks with consistent therapy and rehab.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Medical Oversight</h3>
                <p className="text-dark-500 text-sm leading-relaxed">Sports medicine physician with physio coordination. Imaging review, return-to-sport protocols, and injury-specific dosing adjustments included.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Your Recovery Journey</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">A structured approach to healing and returning to peak performance.</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">HPCSA-Registered Sports Medicine Oversight</h2>
              <p className="text-dark-500 leading-relaxed mb-6">
                Every recovery protocol is prescribed by an HPCSA-registered physician with sports medicine or orthopedic expertise. We review your injury history, imaging, and current training load before designing your healing protocol.
              </p>
              <ul className="space-y-3">
                {[
                  'Complete injury and surgical history review',
                  'Imaging review (MRI, ultrasound, X-ray)',
                  'Physiotherapy coordination and referral',
                  'Injury-specific dosing protocols',
                  'Return-to-sport clearance criteria',
                  'Dose adjustments based on healing stage',
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
                <h3 className="text-xl font-bold text-dark-900 mb-4">Why Injury-Specific Dosing Matters</h3>
                <p className="text-dark-500 text-sm leading-relaxed mb-4">
                  BPC-157 and TB-500 are not one-size-fits-all. Tendon injuries require different dosing than muscle tears. Post-surgical recovery needs higher initial dosing. Your physician customizes the dose, frequency, and injection site based on your specific injury and healing stage.
                </p>
                <div className="bg-white rounded-xl p-4 border border-dark-100">
                  <div className="text-sm font-semibold text-dark-900 mb-2">Typical Recovery Protocol</div>
                  <div className="text-sm text-dark-500 space-y-1">
                    <div>BPC-157: 500 mcg daily near injury site</div>
                    <div>TB-500: 2-5 mg twice weekly</div>
                    <div>Cycle: 4-6 weeks acute; 8-12 weeks chronic</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Muscle Recovery Program</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">Transparent pricing. No hidden fees. Everything you need for safe, effective recovery.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <AnimatedSection className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="text-sm text-dark-400 mb-2">Monthly</div>
              <div className="text-3xl font-bold text-white mb-4">R2,600<span className="text-lg text-dark-400 font-normal">/month</span></div>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>Physician consultation</li>
                <li>Physio coordination</li>
                <li>Prescription & compounding</li>
                <li>Cold-chain delivery</li>
                <li>Imaging review</li>
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 border border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">Best Value</div>
              <div className="text-sm text-primary-200 mb-2">3-Month Prepay (Save 10%)</div>
              <div className="text-3xl font-bold text-white mb-4">R7,020</div>
              <ul className="space-y-2 text-sm text-primary-100">
                <li>Everything in Monthly</li>
                <li>Return-to-sport protocol</li>
                <li>Priority physio access</li>
                <li>Save R780</li>
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="text-sm text-dark-400 mb-2">6-Month Prepay (Save 15%)</div>
              <div className="text-3xl font-bold text-white mb-4">R13,260</div>
              <ul className="space-y-2 text-sm text-dark-300">
                <li>Everything in 3-Month</li>
                <li>Quarterly imaging review</li>
                <li>Priority physician access</li>
                <li>Save R2,340</li>
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
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Muscle Recovery Questions</h2>
            <p className="text-dark-500">Everything you need to know about our recovery protocols.</p>
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
            <Dumbbell className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Back in the Game</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Take our 2-minute assessment and discover how healing peptides can accelerate your recovery and get you back to peak performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment?program=muscle-recovery" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
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
