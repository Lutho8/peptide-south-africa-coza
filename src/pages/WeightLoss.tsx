import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  ArrowRight,
  Scale,
  Stethoscope,
  Shield,
  ChevronDown,
  TrendingDown,
  HeartPulse,
  Star,
  Quote,
  PackageOpen,
  Phone,
  Sparkles,
  FlaskConical,
} from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'

const stats = [
  { value: '15-22%', label: 'Average Weight Loss', icon: TrendingDown },
  { value: '100%', label: 'Physician-Supervised', icon: Stethoscope },
  { value: 'SAHPRA', label: 'Compliant', icon: Shield },
]

const products = [
  {
    name: 'Compounded Tirzepatide',
    tagline: 'Dual-Action GLP-1/GIP Agonist',
    description: 'The most advanced weight-loss peptide available. Tirzepatide works on two hunger-regulating pathways to deliver superior results for patients struggling with obesity and metabolic syndrome.',
    image: 'from-purple-100 to-violet-100',
    link: '/products/compounded-tirzepatide',
    badge: 'Most Popular',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Compounded Semaglutide',
    tagline: 'GLP-1 Receptor Agonist',
    description: 'A proven, clinically validated GLP-1 agonist that reduces appetite, slows gastric emptying, and helps you achieve sustainable weight loss under physician supervision.',
    image: 'from-blue-100 to-indigo-100',
    link: '/products/compounded-semaglutide',
    badge: 'Clinically Proven',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
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

const testimonials = [
  {
    name: 'Thandi M.',
    location: 'Johannesburg',
    quote: 'I lost 18kg in 4 months with Tirzepatide. The physician supervision made all the difference — I felt safe and supported every step of the way.',
    result: '-18kg in 4 months',
  },
  {
    name: 'Mark D.',
    location: 'Cape Town',
    quote: 'After years of yo-yo dieting, Semaglutide finally gave me the control I needed. The team at Ride The Tide is incredibly knowledgeable and responsive.',
    result: '-12kg in 3 months',
  },
  {
    name: 'Sarah K.',
    location: 'Durban',
    quote: 'The personalized protocol, the cold-chain delivery, and the ongoing check-ins — this is how healthcare should be. My energy and confidence are back.',
    result: '-15kg in 5 months',
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
    answer: 'Pricing depends on the peptide, dose, and duration. Monthly protocols range from R2,800 to R4,500, including physician consultation, medication, and ongoing support. Visit our Pricing page for a full breakdown.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-dark-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
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

export default function WeightLoss() {
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
          <AnimatedSection className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Physician-Supervised Protocols
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Science-Backed<br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Weight Loss Protocols
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              Physician-supervised GLP-1 peptide therapy designed for the South African body. 
              Personalized, safe, and proven to deliver 15-22% average weight loss.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="btn-ghost">
                View Pricing
              </Link>
            </div>
          </AnimatedSection>
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

      {/* Featured Products */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Featured Products</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Our Weight Loss Peptides</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Two powerful, physician-prescribed options for sustainable weight management.</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <StaggerItem key={product.name}>
                <div className="card-hover overflow-hidden h-full flex flex-col">
                  <div className={`h-56 bg-gradient-to-br ${product.image} flex items-center justify-center relative`}>
                    <div className="w-24 h-32 bg-white/60 rounded-lg shadow-sm flex items-center justify-center">
                      <PackageOpen className="w-10 h-10 text-dark-400" />
                    </div>
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${product.badgeColor}`}>
                      {product.badge}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-dark-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-primary-600 font-medium mb-3">{product.tagline}</p>
                    <p className="text-dark-500 text-sm leading-relaxed flex-1">{product.description}</p>
                    <Link
                      to={product.link}
                      className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
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

      {/* Success Stories */}
      <section className="section-padding bg-dark-900">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Success Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Real Results, Real People</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">South Africans who transformed their health with Ride The Tide.</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.15}>
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 h-full flex flex-col">
                  <Quote className="w-8 h-8 text-primary-500 mb-4" />
                  <p className="text-dark-300 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                    <div>
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-sm text-dark-500">{t.location}</div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary-500/15 text-primary-400 text-xs font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      {t.result}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <Scale className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Weight Loss Journey</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Join hundreds of South Africans who have taken control of their weight with physician-supervised peptide therapy. Your assessment takes just 10 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/how-it-works" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
                Start Your Assessment
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

          <AnimatedSection delay={0.4} className="text-center mt-8">
            <p className="text-dark-500 mb-4">Still have questions?</p>
            <Link to="/faqs" className="btn-secondary">
              View All FAQs
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
