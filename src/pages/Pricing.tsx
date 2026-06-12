import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  ArrowRight,
  Phone,
  ChevronDown,
  ChevronRight,
  Shield,
  Truck,
  MessageCircle,
  HeartPulse,
  FileText,
  Stethoscope,
  Info,
  Zap,
  BadgeCheck,
} from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'

const pricingData = [
  {
    product: 'Tirzepatide',
    category: 'Weight Loss',
    monthly: 'R4,200',
    perDose: 'R350',
    dose: '5mg weekly',
    includes: 'Consultation, medication, shipping, support',
    popular: true,
  },
  {
    product: 'Semaglutide',
    category: 'Weight Loss',
    monthly: 'R3,200',
    perDose: 'R267',
    dose: '2.4mg weekly',
    includes: 'Consultation, medication, shipping, support',
    popular: false,
  },
  {
    product: 'NAD+',
    category: 'Longevity',
    monthly: 'R3,800',
    perDose: 'R317',
    dose: '500mg bi-weekly',
    includes: 'Consultation, medication, shipping, support',
    popular: false,
  },
  {
    product: 'Sermorelin',
    category: 'Longevity',
    monthly: 'R2,800',
    perDose: 'R233',
    dose: '2mg daily',
    includes: 'Consultation, medication, shipping, support',
    popular: false,
  },
  {
    product: 'Glutathione',
    category: 'Recovery',
    monthly: 'R2,400',
    perDose: 'R200',
    dose: '600mg bi-weekly',
    includes: 'Consultation, medication, shipping, support',
    popular: false,
  },
]

const included = [
  { icon: Stethoscope, title: 'Initial Physician Consultation', description: 'Comprehensive review by a licensed SA doctor.' },
  { icon: FileText, title: 'Personalized Protocol', description: 'Custom dose and schedule tailored to you.' },
  { icon: Truck, title: 'Nationwide Cold-Chain Delivery', description: 'Shipped directly to your door, anywhere in SA.' },
  { icon: MessageCircle, title: 'Ongoing Patient Support', description: 'Direct messaging with your care team.' },
  { icon: HeartPulse, title: 'Monthly Monitoring', description: 'Regular check-ins and dose adjustments.' },
  { icon: Shield, title: 'SAHPRA-Compliant Medication', description: 'Pharmaceutical-grade, third-party tested.' },
]

const faqs = [
  {
    question: 'Is peptide therapy covered by South African medical aid?',
    answer: 'Most South African medical aids do not currently cover peptide therapy for wellness or weight loss, as these are often classified as elective or lifestyle treatments. However, some plans with comprehensive chronic benefits may partially cover consultations. We recommend checking with your specific provider. We can provide itemized invoices for potential reimbursement.',
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No. Our pricing is fully transparent. The monthly fee includes your physician consultation, compounded medication, cold-chain shipping, and ongoing support. There are no surprise charges, no membership fees, and no cancellation penalties.',
  },
  {
    question: 'Can I pause or cancel my protocol?',
    answer: 'Yes. You can pause or cancel at any time with no penalties. We simply ask for 7 days notice before your next compounding date so the pharmacy can adjust their schedule.',
  },
  {
    question: 'Is there a consultation fee separate from medication?',
    answer: 'No. The initial physician consultation is included in your first month. Follow-up consultations for dose adjustments are included in your ongoing monthly fee. You never pay extra for doctor contact.',
  },
  {
    question: 'Do you offer discounts for multi-month commitments?',
    answer: 'Yes. We offer a 10% discount when you commit to a 3-month protocol upfront, and a 15% discount for 6-month commitments. This reflects our confidence in long-term results and reduces administrative overhead.',
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

export default function Pricing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-dark-900">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-primary-950/30 to-dark-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="container-main relative z-10">
          <AnimatedSection className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
              <BadgeCheck className="w-4 h-4" />
              Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Transparent Pricing for<br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Personalized Care
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              No hidden fees. No surprise charges. Just clear, honest pricing for physician-supervised peptide therapy delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact-us" className="btn-ghost">
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Monthly Protocol Pricing</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">All prices include consultation, medication, shipping, and ongoing support.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-dark-200">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-dark-700">Product</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-dark-700">Category</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-dark-700">Typical Dose</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-dark-700">Per Month</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-dark-700">Per Dose</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-dark-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map((row) => (
                    <tr key={row.product} className={`border-b border-dark-100 ${row.popular ? 'bg-primary-50/50' : ''}`}>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-dark-900">{row.product}</span>
                          {row.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">POPULAR</span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4 text-sm text-dark-600">{row.category}</td>
                      <td className="py-5 px-4 text-sm text-dark-500">{row.dose}</td>
                      <td className="py-5 px-4 text-right font-bold text-dark-900">{row.monthly}</td>
                      <td className="py-5 px-4 text-right text-sm text-dark-500">{row.perDose}</td>
                      <td className="py-5 px-4 text-center">
                        <Link to="/how-it-works" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                          Start <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-sm text-dark-400 mt-4">
              Prices are indicative and may vary based on individual dosing requirements. Final pricing confirmed during physician consultation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Inclusions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">What's Included</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Every protocol includes comprehensive care from start to finish.</p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {included.map((item) => (
              <StaggerItem key={item.title}>
                <div className="card-hover p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-1">{item.title}</h3>
                  <p className="text-dark-500 text-sm">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Insurance */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Medical Aid</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Is Peptide Therapy Covered?</h2>
              <p className="text-dark-500 leading-relaxed mb-4">
                Peptide therapy for weight loss, longevity, and wellness is generally classified as elective or lifestyle medicine by South African medical aid schemes. This means most plans do not cover the medication itself.
              </p>
              <p className="text-dark-500 leading-relaxed mb-6">
                However, some comprehensive plans may partially cover the physician consultation component. We provide detailed, itemized invoices that you can submit to your medical aid for potential reimbursement.
              </p>
              <div className="bg-dark-50 rounded-xl p-5 border border-dark-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-dark-900 mb-1">FSA / HSA Compatible</h4>
                    <p className="text-sm text-dark-500">If you have a Flexible Spending Account or Health Savings Account through your employer, peptide therapy may be eligible for reimbursement. We can provide supporting documentation.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="h-80 lg:h-96 rounded-2xl bg-gradient-to-br from-primary-100 via-accent-100 to-primary-100 flex items-center justify-center">
                <div className="w-32 h-32 bg-white/60 rounded-2xl shadow-sm flex items-center justify-center">
                  <Shield className="w-14 h-14 text-primary-500" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-dark-50">
        <div className="container-main max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Pricing Questions</h2>
            <p className="text-dark-500">Common questions about costs, coverage, and commitments.</p>
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

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-700">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <Zap className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Your personalized protocol is just a few clicks away. No commitment required for the assessment — just honest information about your options.
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
    </div>
  )
}
