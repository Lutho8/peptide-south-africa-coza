import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Heart,
  Brain,
  Zap,
  Activity,
  Shield,
  Clock,
  Dna,
  Phone,
  Microscope,
  Infinity,
  Sun,
  RefreshCw,
} from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'
import { productImages, videoUrls } from '../lib/assets'

const products = [
  {
    name: 'NAD+',
    tagline: 'Cellular Energy & DNA Repair',
    description: 'NAD+ (Nicotinamide Adenine Dinucleotide) is the coenzyme that fuels cellular metabolism, repairs DNA, and activates sirtuins — the proteins that regulate aging.',
    image: productImages.nadSpray,
    link: '/products/nad',
    badge: 'Anti-Aging',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Sermorelin',
    tagline: 'Growth Hormone Secretagogue',
    description: 'Sermorelin stimulates your pituitary gland to naturally produce growth hormone, supporting muscle preservation, fat metabolism, and deep sleep quality.',
    image: productImages.sermorelinVial,
    link: '/products/sermorelin',
    badge: 'Vitality',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Glutathione',
    tagline: 'Master Antioxidant',
    description: 'The body\'s most powerful antioxidant, glutathione neutralizes free radicals, supports detoxification, and brightens skin from the inside out.',
    image: productImages.glutathioneVial,
    link: '/products/glutathione',
    badge: 'Recovery',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
]

const benefits = [
  { icon: Dna, title: 'Cellular Health', description: 'Repair DNA damage and restore mitochondrial function at the cellular level.' },
  { icon: Brain, title: 'Cognitive Function', description: 'Sharpen mental clarity, memory, and focus through neuroprotective pathways.' },
  { icon: Zap, title: 'Energy & Vitality', description: 'Combat fatigue and restore the natural energy levels of your younger years.' },
  { icon: RefreshCw, title: 'Recovery', description: 'Speed up muscle repair, reduce inflammation, and bounce back faster.' },
  { icon: Sun, title: 'Skin Health', description: 'Improve elasticity, reduce wrinkles, and achieve a brighter, more even complexion.' },
  { icon: Activity, title: 'Metabolism', description: 'Optimize metabolic pathways for efficient fat burning and stable blood sugar.' },
]

export default function Longevity() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-dark-900">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videoUrls.stocksy.mp4} type="video/mp4" />
          <source src={videoUrls.stocksy.webm} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/90 via-dark-900/80 to-dark-900/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-emerald-950/30 to-dark-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="container-main relative z-10">
          <AnimatedSection className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-6">
              <Infinity className="w-4 h-4" />
              Wellness & Longevity Protocols
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Wellness &<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Longevity Protocols
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              Science-backed peptide protocols designed to optimize cellular health, slow biological aging, and help you feel younger, longer.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Start Your Longevity Protocol
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="btn-ghost">
                View Pricing
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img
                  src={productImages.nadPills}
                  alt="NAD+ Pills"
                  className="w-full h-full object-contain rounded-2xl"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Our Philosophy</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Aging Is Not Inevitable. It Is Treatable.</h2>
              <p className="text-dark-500 leading-relaxed mb-4">
                Modern science has revealed that aging is not simply a matter of time — it is a biological process driven by cellular decline, DNA damage, and metabolic dysfunction. Peptide therapy addresses these root causes directly.
              </p>
              <p className="text-dark-500 leading-relaxed mb-6">
                At Peptide South Africa, we combine cutting-edge longevity research with personalized physician oversight to help you optimize your healthspan, not just your lifespan. Our protocols are tailored to your biomarkers, goals, and lifestyle.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Microscope className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-dark-700">Protocols based on peer-reviewed longevity research</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Featured Products</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Longevity Peptides</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Three powerful compounds to optimize cellular health and slow biological aging.</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {products.map((product) => (
              <StaggerItem key={product.name}>
                <div className="card-hover overflow-hidden h-full flex flex-col">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${product.badgeColor}`}>
                      {product.badge}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-dark-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium mb-3">{product.tagline}</p>
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

      {/* Benefits Grid */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">What Longevity Peptides Can Do For You</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Comprehensive benefits that target the root causes of aging.</p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {benefits.map((b) => (
              <StaggerItem key={b.title}>
                <div className="card-hover p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{b.title}</h3>
                  <p className="text-dark-500 text-sm leading-relaxed">{b.description}</p>
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
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">The Science</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">How Peptide Therapy Supports Longevity</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Dna className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">DNA Repair & Sirtuin Activation</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">NAD+ activates sirtuins, the &ldquo;longevity genes&rdquo; that repair DNA damage and regulate cellular stress responses.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Mitochondrial Optimization</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Peptides boost mitochondrial biogenesis and ATP production, restoring the energy levels of your cellular prime.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Oxidative Stress Reduction</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Glutathione and NAD+ neutralize free radicals before they can damage cells, proteins, and DNA.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Telomere Support</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Growth hormone secretagogues like Sermorelin help maintain telomere integrity, a key marker of biological age.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <img 
                src={productImages.nadPills} 
                alt="NAD+ Pills" 
                className="w-full h-80 lg:h-96 object-contain rounded-2xl border border-dark-700"
                loading="lazy"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <Heart className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Longevity Protocol</h2>
            <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
              Invest in your future self. Begin a personalized longevity protocol designed by South African physicians who understand the science of aging.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/how-it-works" className="btn-primary bg-white text-emerald-700 hover:bg-emerald-50 shadow-none">
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
