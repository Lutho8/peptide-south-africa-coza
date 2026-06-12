import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Users,
  Stethoscope,
  Heart,
  MapPin,
  Phone,
  Microscope,
} from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'

const values = [
  {
    icon: Microscope,
    title: 'Science-First',
    description: 'Every protocol is grounded in peer-reviewed research, clinical data, and evidence-based medicine. We do not follow trends — we follow the science.',
  },
  {
    icon: Stethoscope,
    title: 'Physician-Supervised',
    description: 'Licensed South African physicians review every case, design every protocol, and monitor every patient. Safety is never optional.',
  },
  {
    icon: Heart,
    title: 'Patient-Centered',
    description: 'Your goals, your body, your protocol. We listen first, then prescribe. Every treatment plan is personalized to your unique biology and lifestyle.',
  },
  {
    icon: MapPin,
    title: 'South African',
    description: 'Built for South Africans, by South Africans. SAHPRA-compliant, locally compounded, and designed for the realities of our healthcare landscape.',
  },
]

const team = [
  {
    initials: 'SN',
    name: 'Dr. Sarah Nkosi',
    title: 'Medical Director',
    gradient: 'from-primary-400 to-accent-500',
    description: 'Board-certified physician with 15+ years in metabolic medicine and peptide therapy research.',
  },
  {
    initials: 'JV',
    name: 'Dr. James Van der Merwe',
    title: 'Lead Physician',
    gradient: 'from-emerald-400 to-teal-500',
    description: 'Specialist in longevity medicine and endocrinology. Passionate about accessible, personalized healthcare.',
  },
  {
    initials: 'LK',
    name: 'Lutho Kote',
    title: 'Founder & CEO',
    gradient: 'from-amber-400 to-orange-500',
    description: 'Biohacker and entrepreneur who built Ride The Tide to bring world-class peptide therapy to South Africa.',
  },
]

const partners = [
  { name: 'SAHPRA', color: 'from-blue-400 to-indigo-500' },
  { name: 'Compounding SA', color: 'from-emerald-400 to-teal-500' },
  { name: 'BioHealth Labs', color: 'from-purple-400 to-pink-500' },
  { name: 'MediTrust', color: 'from-amber-400 to-orange-500' },
  { name: 'CapeBio', color: 'from-cyan-400 to-blue-500' },
  { name: 'SAGSSA', color: 'from-rose-400 to-red-500' },
]

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-dark-900">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-primary-950/30 to-dark-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="container-main relative z-10">
          <AnimatedSection className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              About Ride The Tide
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              We exist for people who are<br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                intentional about their health.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              Ride The Tide is South Africa's leading physician-guided peptide protocol platform. We connect patients with licensed doctors and SAHPRA-compliant pharmacies to deliver personalized, safe, and effective peptide therapy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                How It Works
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact-us" className="btn-ghost">
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-main max-w-4xl">
          <AnimatedSection className="text-center">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-6">
              Making World-Class Peptide Therapy Accessible to Every South African
            </h2>
            <p className="text-dark-500 text-lg leading-relaxed mb-6">
              We believe that cutting-edge medicine should not be reserved for the elite. Our mission is to democratize access to peptide therapy — a category of medicine that has the potential to transform weight management, longevity, recovery, and overall wellness.
            </p>
            <p className="text-dark-500 text-lg leading-relaxed">
              By combining telehealth convenience with rigorous clinical oversight, we have built a platform that delivers the safety of a traditional clinic with the accessibility of modern technology. Every protocol is prescribed by a doctor. Every compound is tested for purity. Every patient is monitored throughout their journey.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">What We Stand For</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Four principles that guide every decision we make.</p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="card-hover p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{v.title}</h3>
                  <p className="text-dark-500 text-sm leading-relaxed">{v.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">The Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Meet the People Behind the Science</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">A multidisciplinary team of doctors, scientists, and healthcare innovators.</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto" staggerDelay={0.15}>
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="text-center">
                  <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                    <span className="text-white font-bold text-2xl">{member.initials}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-primary-600 font-medium mb-3">{member.title}</p>
                  <p className="text-dark-500 text-sm leading-relaxed max-w-xs mx-auto">{member.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Press / Partners */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Partners & Compliance</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Trusted By Industry Leaders</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">We work with the best pharmacies, labs, and regulatory bodies in South Africa.</p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" staggerDelay={0.08}>
            {partners.map((p) => (
              <StaggerItem key={p.name}>
                <div className={`h-24 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-sm`}>
                  <span className="text-white font-bold text-sm px-2 text-center">{p.name}</span>
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
            <Users className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join the Ride The Tide Community</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Be part of a movement that is redefining healthcare in South Africa. Whether you are starting your weight-loss journey, optimizing your longevity, or recovering from injury — we are here to ride the tide with you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/how-it-works" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
                Get Started
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
