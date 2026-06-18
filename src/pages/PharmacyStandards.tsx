import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Shield,
  FlaskConical,
  Microscope,
  Truck,
  CheckCircle2,
  Phone,
  FileCheck,
  Thermometer,
  Beaker,
  MapPin,
  BadgeCheck,
} from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'
import { partnerImages, videoUrls } from '../lib/assets'

const trustIndicators = [
  { icon: Shield, title: 'SAHPRA Compliant', description: 'All protocols and pharmacies meet South African Health Products Regulatory Authority standards.' },
  { icon: FlaskConical, title: 'USP Compounding', description: 'Medications compounded according to United States Pharmacopeia quality standards.' },
  { icon: Microscope, title: '3rd Party Tested', description: 'Independent laboratories verify purity, potency, and sterility of every batch.' },
  { icon: Thermometer, title: 'Cold Chain Verified', description: 'Temperature-controlled shipping from pharmacy to your door with real-time tracking.' },
]

const qualitySteps = [
  {
    number: '01',
    title: 'Sourcing',
    description: 'We source only pharmaceutical-grade raw materials from certified suppliers with full chain-of-custody documentation.',
    icon: Beaker,
    color: 'from-primary-500 to-primary-700',
  },
  {
    number: '02',
    title: 'Compounding',
    description: 'Licensed pharmacists compound your medication in a sterile, controlled environment following strict USP <797> and <795> guidelines.',
    icon: FlaskConical,
    color: 'from-accent-500 to-primary-600',
  },
  {
    number: '03',
    title: 'Testing',
    description: 'Every batch undergoes independent third-party testing for purity, potency, sterility, and endotoxin levels before release.',
    icon: Microscope,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    number: '04',
    title: 'Delivery',
    description: 'Cold-chain logistics ensure your medication remains at the optimal temperature throughout transit, with delivery confirmation.',
    icon: Truck,
    color: 'from-amber-500 to-orange-600',
  },
]

const pharmacies = [
  {
    name: 'Cape Compounding Pharmacy',
    location: 'Cape Town, Western Cape',
    description: 'Specialist compounding pharmacy with ISO-certified cleanrooms and full SAHPRA licensing.',
    certifications: ['SAHPRA Licensed', 'ISO 9001', 'USP <797>'],
    image: partnerImages.wasefHealth,
  },
  {
    name: 'BioHealth Compounding',
    location: 'Johannesburg, Gauteng',
    description: 'Leading compounding facility serving the Highveld with state-of-the-art analytical testing labs.',
    certifications: ['SAHPRA Licensed', '3rd Party Tested', 'Cold Chain Certified'],
    image: partnerImages.bask,
  },
  {
    name: 'KZN Pharma Solutions',
    location: 'Durban, KwaZulu-Natal',
    description: 'Coastal compounding specialist with expertise in temperature-sensitive peptide formulations.',
    certifications: ['SAHPRA Licensed', 'USP <795>', 'GMP Certified'],
    image: partnerImages.hillsideMorning,
  },
]

export default function PharmacyStandards() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-dark-900">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videoUrls.stocksy.mp4} type="video/mp4" />
          <source src={videoUrls.stocksy.webm} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/90 via-dark-900/80 to-dark-900/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-primary-950/30 to-dark-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="container-main relative z-10">
          <AnimatedSection className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
              <BadgeCheck className="w-4 h-4" />
              Quality & Compliance
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Our<br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Pharmacy Standards
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              We hold ourselves to the highest standards in pharmaceutical compounding, testing, and delivery. Your safety is our non-negotiable priority.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Learn About Our Process
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact-us" className="btn-ghost">
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Trust</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Why You Can Trust Our Process</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Four pillars that underpin every vial we deliver.</p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {trustIndicators.map((t) => (
              <StaggerItem key={t.title}>
                <div className="card-hover p-6 h-full text-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-4">
                    <t.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{t.title}</h3>
                  <p className="text-dark-500 text-sm leading-relaxed">{t.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Quality Process */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Our 4-Step Quality Process</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">From raw material to your doorstep, every step is verified and documented.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-emerald-200" />
            <StaggerContainer className="contents" staggerDelay={0.15}>
              {qualitySteps.map((step) => (
                <StaggerItem key={step.number}>
                  <div className="relative text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
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

      {/* Partner Pharmacies */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Partners</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Partner Pharmacies</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">We work with SAHPRA-compliant compounding pharmacies across South Africa.</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {pharmacies.map((p) => (
              <StaggerItem key={p.name}>
                <div className="card-hover overflow-hidden h-full flex flex-col">
                  <div className="h-32 bg-white flex items-center justify-center border-b border-dark-100">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="max-h-24 max-w-[90%] object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-dark-900 mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-dark-500 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {p.location}
                    </div>
                    <p className="text-dark-500 text-sm leading-relaxed mb-4 flex-1">{p.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.certifications.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testing Section */}
      <section className="section-padding bg-dark-900">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Testing</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Purity & Potency Testing</h2>
              <p className="text-dark-400 leading-relaxed mb-6">
                Every batch of peptide medication we dispense undergoes rigorous independent testing before it ever reaches a patient. This is not optional — it is mandatory.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Microscope className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">HPLC Purity Analysis</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">High-Performance Liquid Chromatography verifies that the peptide is free from contaminants and degradation products.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FlaskConical className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Mass Spectrometry</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Confirms molecular identity and weight, ensuring the exact peptide sequence was synthesized correctly.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Sterility & Endotoxin Testing</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Ensures the product is free from bacterial contamination and endotoxins that could cause adverse reactions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileCheck className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Certificate of Analysis</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Every batch ships with a complete CoA documenting all test results, signed by the testing laboratory.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img
                  src={partnerImages.hillsideMorning}
                  alt="SAHPRA compliant pharmacy"
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-700">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <Shield className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Learn About Our Process</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Have questions about our pharmacy standards, testing protocols, or compliance practices? Our team is here to provide complete transparency.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/how-it-works" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
                How It Works
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact-us" className="btn-ghost">
                <Phone className="w-4 h-4" />
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
