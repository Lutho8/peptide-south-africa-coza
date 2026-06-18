import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ClipboardList,
  Stethoscope,
  PackageOpen,
  Phone,
  CheckCircle2,
  Shield,
  Truck,
  MessageCircle,
  HeartPulse,
  FileText,
  Zap,
  Calendar,
} from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'
import { howItWorksImages, videoUrls } from '../lib/assets'

const steps = [
  {
    number: '01',
    title: 'A Simple Questionnaire',
    description: 'Begin your journey with a comprehensive online health assessment. We cover your medical history, current medications, weight goals, lifestyle habits, and any previous peptide experience. This takes 10-15 minutes and ensures your physician has everything they need to make an informed decision.',
    icon: ClipboardList,
    color: 'from-primary-500 to-primary-700',
    lightColor: 'bg-primary-100',
    image: howItWorksImages.questionnaire,
    iconColor: 'text-primary-600',
    features: ['Takes 10-15 minutes', 'Mobile-friendly', 'Secure & encrypted', 'No obligation'],
  },
  {
    number: '02',
    title: 'Physician Review',
    description: 'A licensed South African physician reviews your submission within 24-48 hours. They evaluate your eligibility, assess potential contraindications, and design a personalized protocol including dosage, frequency, and monitoring schedule. You may be contacted for a brief telehealth consultation if needed.',
    icon: Stethoscope,
    color: 'from-accent-500 to-primary-600',
    lightColor: 'bg-accent-100',
    image: howItWorksImages.physicianReview,
    iconColor: 'text-accent-600',
    features: ['24-48 hour review', 'Personalized protocol', 'Telehealth if needed', 'Contraindication check'],
  },
  {
    number: '03',
    title: 'Protocol Delivered',
    description: 'Your medication is compounded at a SAHPRA-compliant pharmacy using pharmaceutical-grade ingredients. It is shipped cold-chain to your door within 2-3 business days. You receive detailed instructions, a dosing schedule, and direct access to your physician for ongoing support.',
    icon: PackageOpen,
    color: 'from-emerald-500 to-teal-600',
    lightColor: 'bg-emerald-100',
    image: howItWorksImages.protocolDelivered,
    iconColor: 'text-emerald-600',
    features: ['Cold-chain delivery', '2-3 day shipping', 'Detailed instructions', 'Ongoing support'],
  },
]

const included = [
  { icon: Stethoscope, title: 'Physician Consultation', description: 'Full review by a licensed SA doctor.' },
  { icon: FileText, title: 'Personalized Protocol', description: 'Custom dose and schedule for your body.' },
  { icon: Truck, title: 'Nationwide Delivery', description: 'Cold-chain shipping to any SA address.' },
  { icon: MessageCircle, title: '24/7 Support', description: 'Direct messaging with your care team.' },
  { icon: HeartPulse, title: 'Ongoing Monitoring', description: 'Regular check-ins and dose adjustments.' },
  { icon: Shield, title: 'SAHPRA Compliance', description: 'All medications from compliant pharmacies.' },
]

const timeline = [
  { time: 'Day 0', title: 'Submit Assessment', description: 'Complete your online questionnaire.' },
  { time: 'Day 1-2', title: 'Physician Review', description: 'Doctor reviews and creates your protocol.' },
  { time: 'Day 3-5', title: 'Compounding', description: 'Pharmacy prepares your medication.' },
  { time: 'Day 5-7', title: 'Delivery', description: 'Your protocol arrives at your door.' },
  { time: 'Week 1-4', title: 'Initial Phase', description: 'Start your protocol, report early effects.' },
  { time: 'Month 1+', title: 'Ongoing Care', description: 'Monthly check-ins, dose optimization, results.' },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-dark-900">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videoUrls.base.mp4} type="video/mp4" />
          <source src={videoUrls.base.webm} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/90 via-dark-900/80 to-dark-900/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-primary-950/30 to-dark-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="container-main relative z-10">
          <AnimatedSection className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Simple & Streamlined
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              3-Step Process to Your<br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Personalized Protocol
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              From assessment to doorstep in under a week. No clinic visits, no waiting rooms — just physician-guided care delivered to you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Start Your Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="btn-ghost">
                View Pricing
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">The Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">How It Works</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Three simple steps from curiosity to transformation.</p>
          </AnimatedSection>

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <AnimatedSection key={step.number} direction={index % 2 === 0 ? 'left' : 'right'}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="h-64 lg:h-80 rounded-2xl relative overflow-hidden">
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                      <div className={`absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-xl">{step.number}</span>
                      </div>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="text-sm font-bold text-primary-600 mb-2">Step {step.number}</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4">{step.title}</h3>
                    <p className="text-dark-500 leading-relaxed mb-6">{step.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {step.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-sm text-dark-600">
                          <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Timeline</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Your Journey at a Glance</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">A typical timeline from first click to first dose.</p>
          </AnimatedSection>

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 to-accent-300 -translate-x-1/2" />
            <div className="space-y-8 md:space-y-0">
              {timeline.map((item, i) => (
                <AnimatedSection key={item.time} delay={i * 0.1} className={`md:flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center md:gap-8`}>
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-dark-100 inline-block text-left md:min-w-[260px]">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <span className="text-xs font-bold text-primary-600 uppercase">{item.time}</span>
                      </div>
                      <h4 className="font-bold text-dark-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-dark-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 items-center justify-center border-4 border-white shadow-sm z-10 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="md:w-1/2" />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Inclusions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">What's Included</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Every protocol comes with comprehensive care and support.</p>
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

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-700">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <ClipboardList className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start?</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Your personalized protocol is just 10 minutes away. Complete your assessment now and have a physician review your case within 24-48 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/how-it-works" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
                Start Your Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact-us" className="btn-ghost">
                <Phone className="w-4 h-4" />
                Have Questions?
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
