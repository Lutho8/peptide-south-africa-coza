import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Dna,
  Scale,
  Infinity,
  HeartPulse,
  Brain,
  Shield,
  Sun,
  FlaskConical,
  ChevronRight,
  Phone,
  Zap,
  Atom,
  CheckCircle2,
} from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'
import { productImages, videoUrls } from '../lib/assets'

const conditions = [
  { icon: Scale, title: 'Weight Loss', description: 'GLP-1 agonists that suppress appetite and accelerate fat loss.', color: 'from-purple-100 to-violet-100', iconColor: 'text-purple-600', link: '/weight-loss', image: productImages.tirzepatideBottle },
  { icon: Infinity, title: 'Longevity', description: 'NAD+, Sermorelin, and glutathione for cellular optimization.', color: 'from-emerald-100 to-green-100', iconColor: 'text-emerald-600', link: '/longevity', image: productImages.nadSpray },
  { icon: HeartPulse, title: 'Recovery', description: 'Peptides that accelerate healing, reduce inflammation, and restore energy.', color: 'from-red-100 to-orange-100', iconColor: 'text-red-600', link: '/recovery', image: productImages.sermorelinVial },
  { icon: Brain, title: 'Cognitive Enhancement', description: 'Neuroprotective peptides that support memory, focus, and clarity.', color: 'from-blue-100 to-indigo-100', iconColor: 'text-blue-600', link: '/products/nad', image: productImages.glutathioneVial },
  { icon: Shield, title: 'Immune Support', description: 'Strengthen your body\'s natural defenses at the cellular level.', color: 'from-amber-100 to-yellow-100', iconColor: 'text-amber-600', link: '/products/glutathione', image: productImages.semaglutideBottle },
  { icon: Sun, title: 'Skin Health', description: 'Boost collagen, improve elasticity, and brighten complexion from within.', color: 'from-rose-100 to-pink-100', iconColor: 'text-rose-600', link: '/products/glutathione', image: productImages.tirzepatideBottle },
]

const peptides = [
  {
    name: 'Tirzepatide',
    tagline: 'Dual GLP-1/GIP Agonist',
    description: 'The most advanced weight-loss peptide. Targets two hunger-regulating pathways for superior results.',
    image: productImages.tirzepatideBottle,
    link: '/products/compounded-tirzepatide',
    badge: 'Weight Loss',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Semaglutide',
    tagline: 'GLP-1 Receptor Agonist',
    description: 'Clinically proven to reduce appetite and promote sustained weight loss with extensive safety data.',
    image: productImages.semaglutideBottle,
    link: '/products/compounded-semaglutide',
    badge: 'Weight Loss',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'NAD+',
    tagline: 'Cellular Energy & Repair',
    description: 'The coenzyme that powers mitochondria, repairs DNA, and activates longevity genes.',
    image: productImages.nadSpray,
    link: '/products/nad',
    badge: 'Longevity',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Sermorelin',
    tagline: 'Growth Hormone Secretagogue',
    description: 'Stimulates natural growth hormone release for muscle preservation, fat metabolism, and sleep quality.',
    image: productImages.sermorelinVial,
    link: '/products/sermorelin',
    badge: 'Longevity',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Glutathione',
    tagline: 'Master Antioxidant',
    description: 'Neutralizes free radicals, supports detoxification, and promotes brighter, healthier skin.',
    image: productImages.glutathioneVial,
    link: '/products/glutathione',
    badge: 'Recovery',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
]

export default function PeptideTherapy() {
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
              <Dna className="w-4 h-4" />
              Education
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              What is<br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Peptide Therapy?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              A groundbreaking approach to medicine that uses short chains of amino acids to regulate, restore, and optimize your body's natural functions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Explore Protocols
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/research-vs-prescribed" className="btn-ghost">
                Why Prescribed?
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Education */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img
                  src={productImages.tirzepatideBottle}
                  alt="Peptide therapy"
                  className="w-full h-full object-contain rounded-2xl"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">The Basics</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Peptides Are Nature's Signaling Molecules</h2>
              <p className="text-dark-500 leading-relaxed mb-4">
                Peptides are short chains of amino acids — the building blocks of proteins — that act as signaling molecules in your body. They tell your cells what to do, when to do it, and how to do it better.
              </p>
              <p className="text-dark-500 leading-relaxed mb-4">
                Unlike traditional drugs that often force a single biological response, peptides work with your body's natural pathways. They gently nudge systems back into balance: hunger regulation, hormone production, cellular repair, and immune defense.
              </p>
              <p className="text-dark-500 leading-relaxed mb-6">
                Peptide therapy has been used in medicine for decades (insulin is a peptide), but recent advances have unlocked new applications for weight loss, longevity, recovery, and cognitive health.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-dark-700">50+ peptides currently approved for medical use worldwide</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What We Treat */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Applications</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">What We Treat</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Peptide therapy addresses a wide range of health and wellness goals.</p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {conditions.map((c) => (
              <StaggerItem key={c.title}>
                <Link to={c.link} className="block card-hover p-6 h-full hover:no-underline">
                  <div className="h-24 rounded-xl bg-white border border-dark-100 overflow-hidden mb-4">
                    <img src={c.image} alt={c.title} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{c.title}</h3>
                  <p className="text-dark-500 text-sm leading-relaxed">{c.description}</p>
                  <div className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary-600">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Popular Peptides */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Our Products</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Popular Peptides</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Five physician-prescribed peptides, each targeting specific health outcomes.</p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {peptides.map((p) => (
              <StaggerItem key={p.name}>
                <div className="card-hover overflow-hidden h-full flex flex-col">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-dark-900 mb-1">{p.name}</h3>
                    <p className="text-sm text-primary-600 font-medium mb-3">{p.tagline}</p>
                    <p className="text-dark-500 text-sm leading-relaxed flex-1">{p.description}</p>
                    <Link
                      to={p.link}
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

      {/* Science Section */}
      <section className="section-padding bg-dark-900">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">The Science</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">How Peptides Work in the Body</h2>
              <p className="text-dark-400 leading-relaxed mb-6">
                Peptides function as messengers. They bind to specific receptors on cell surfaces, triggering cascades of biological activity that regulate everything from metabolism to immune response.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Atom className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Receptor Binding</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Peptides bind to cell-surface receptors with high specificity, initiating targeted cellular responses.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Signal Transduction</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">The binding event triggers intracellular signaling cascades that amplify the message throughout the cell.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HeartPulse className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Physiological Response</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">The cell adjusts its behavior: producing hormones, repairing DNA, burning fat, or regenerating tissue.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img
                  src={productImages.nadPills}
                  alt="NAD+ science"
                  className="w-full h-full object-contain rounded-2xl border border-dark-700"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img
                  src={productImages.glutathioneVial}
                  alt="Glutathione vial"
                  className="w-full h-full object-contain rounded-2xl"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Safety</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Are Peptides Safe?</h2>
              <p className="text-dark-500 leading-relaxed mb-4">
                Yes — when prescribed and monitored by a licensed physician. Peptide therapy has an excellent safety profile because peptides are naturally occurring compounds that your body already produces and recognizes.
              </p>
              <p className="text-dark-500 leading-relaxed mb-6">
                At Peptide South Africa, safety is our highest priority. Every patient undergoes a thorough medical review. Every protocol is individualized. Every medication is compounded by a SAHPRA-compliant pharmacy. And every patient has ongoing access to their physician.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-dark-700 text-sm">Physician-prescribed and monitored</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-dark-700 text-sm">SAHPRA-compliant compounding pharmacies</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-dark-700 text-sm">Third-party purity and potency testing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-dark-700 text-sm">Contraindication screening before prescription</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-700">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <Dna className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Protocols</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Discover the right peptide protocol for your goals. Whether it is weight loss, longevity, or recovery — we have a physician-designed solution for you.
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
