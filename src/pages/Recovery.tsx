import { Link } from 'react-router-dom'
import {
  ArrowRight,
  HeartPulse,
  Zap,
  Shield,
  Dna,
  Activity,
  Timer,
  Flame,
  Brain,
  TrendingUp,
  Phone,
} from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'
import { productImages, howItWorksImages, videoUrls } from '../lib/assets'

const products = [
  {
    name: 'NAD+',
    tagline: 'Cellular Recovery & Energy',
    description: 'Accelerate post-workout recovery, reduce muscle fatigue, and restore cellular energy after intense physical exertion. NAD+ is the fuel your mitochondria need to repair and rebuild.',
    image: productImages.nadSpray,
    link: '/products/nad',
    badge: 'Athletic Recovery',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    name: 'Glutathione',
    tagline: 'Inflammation & Healing',
    description: 'Reduce exercise-induced inflammation, speed up injury healing, and support your immune system during demanding training blocks. The master antioxidant for active bodies.',
    image: productImages.glutathioneVial,
    link: '/products/glutathione',
    badge: 'Healing',
    badgeColor: 'bg-cyan-100 text-cyan-700',
  },
]

const useCases = [
  {
    icon: Activity,
    title: 'Athletic Recovery',
    description: 'Reduce DOMS, speed up muscle repair, and get back to peak performance faster after training sessions.',
  },
  {
    icon: HeartPulse,
    title: 'Injury Healing',
    description: 'Support tissue regeneration, collagen synthesis, and inflammatory response management for faster recovery from injuries.',
  },
  {
    icon: Shield,
    title: 'Post-Surgery',
    description: 'Optimize wound healing, reduce scarring, and restore energy levels during surgical recovery with targeted peptide support.',
  },
  {
    icon: Zap,
    title: 'Chronic Fatigue',
    description: 'Address persistent fatigue at the cellular level by restoring mitochondrial function and ATP production.',
  },
]

const benefits = [
  { icon: Timer, title: 'Faster Recovery', description: 'Cut recovery time between workouts or injuries by up to 40%.' },
  { icon: Flame, title: 'Reduced Inflammation', description: 'Lower systemic inflammation markers and exercise-induced oxidative stress.' },
  { icon: Dna, title: 'Cellular Repair', description: 'Activate DNA repair mechanisms and support tissue regeneration at the source.' },
  { icon: Brain, title: 'Mental Clarity', description: 'Combat brain fog and restore cognitive sharpness after physical exertion.' },
  { icon: TrendingUp, title: 'Performance Gains', description: 'Train harder and more frequently with shortened recovery windows.' },
  { icon: Shield, title: 'Immune Support', description: 'Maintain immune function during high-intensity training periods.' },
]

export default function Recovery() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-dark-900">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videoUrls.recovery.mp4} type="video/mp4" />
          <source src={videoUrls.recovery.webm} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/90 via-dark-900/80 to-dark-900/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-red-950/20 to-dark-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="container-main relative z-10">
          <AnimatedSection className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/15 border border-red-500/20 text-red-300 text-sm font-medium mb-6">
              <HeartPulse className="w-4 h-4" />
              Recovery Protocols
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Recovery Protocols for<br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Peak Performance
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              Physician-designed recovery protocols using NAD+ and Glutathione to accelerate healing, reduce inflammation, and get you back to doing what you love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Start Your Recovery Protocol
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="btn-ghost">
                View Pricing
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Recovery Peptides</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Products for Recovery</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Two powerful compounds designed to repair, restore, and rebuild.</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" staggerDelay={0.15}>
            {products.map((product) => (
              <StaggerItem key={product.name}>
                <div className="card-hover overflow-hidden h-full flex flex-col">
                  <div className="h-56 relative overflow-hidden">
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
                    <p className="text-sm text-red-600 font-medium mb-3">{product.tagline}</p>
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

      {/* Use Cases */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Use Cases</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">When Recovery Peptides Help</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">From elite athletes to post-surgical patients, recovery peptides accelerate the healing process.</p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {useCases.map((uc) => (
              <StaggerItem key={uc.title}>
                <div className="card-hover p-6 h-full text-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                    <uc.icon className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{uc.title}</h3>
                  <p className="text-dark-500 text-sm leading-relaxed">{uc.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-dark-900">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Recovery Benefits</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">What you can expect when you optimize recovery with peptide therapy.</p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {benefits.map((b) => (
              <StaggerItem key={b.title}>
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 h-full">
                  <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{b.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How Peptides Support Recovery */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">The Mechanism</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-6">How Peptides Support Recovery</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Dna className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-900 mb-1">Mitochondrial Restoration</h4>
                    <p className="text-dark-500 text-sm leading-relaxed">NAD+ replenishes cellular energy stores, enabling faster muscle tissue repair and reducing post-exercise fatigue.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-900 mb-1">Anti-Inflammatory Action</h4>
                    <p className="text-dark-500 text-sm leading-relaxed">Glutathione scavenges free radicals and modulates the inflammatory cascade, preventing excessive tissue damage.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HeartPulse className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-900 mb-1">Tissue Regeneration</h4>
                    <p className="text-dark-500 text-sm leading-relaxed">Peptides stimulate collagen synthesis, angiogenesis, and stem cell activation to rebuild damaged tissue from within.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-900 mb-1">Neurological Recovery</h4>
                    <p className="text-dark-500 text-sm leading-relaxed">NAD+ supports neuronal repair and neurotransmitter balance, helping restore mental clarity after physical trauma.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <img 
                src={howItWorksImages.physicianReview} 
                alt="Physician Review" 
                className="w-full h-80 lg:h-96 object-contain rounded-2xl"
                loading="lazy"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-red-600 to-orange-700">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <HeartPulse className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Recovery Protocol</h2>
            <p className="text-red-100 text-lg mb-8 leading-relaxed">
              Whether you are recovering from injury, surgery, or simply pushing your limits — our physician-designed protocols help you heal faster and perform better.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/how-it-works" className="btn-primary bg-white text-red-700 hover:bg-red-50 shadow-none">
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
