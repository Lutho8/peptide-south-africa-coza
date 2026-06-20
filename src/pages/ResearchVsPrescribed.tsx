import { Link } from 'react-router-dom'
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  Phone,
  Quote,
  BadgeCheck,
} from 'lucide-react'
import { AnimatedSection } from '../components/pages/AnimatedSection'
import { productImages } from '../lib/assets'

const comparisonRows = [
  {
    category: 'Safety',
    research: 'No physician oversight. Unknown sourcing. No contraindication screening.',
    prescribed: 'Licensed physician reviews your full medical history and monitors you throughout.',
    winner: 'prescribed',
  },
  {
    category: 'Quality',
    research: 'Unregulated manufacturing. No purity testing. Risk of contaminants or incorrect peptides.',
    prescribed: 'SAHPRA-compliant pharmacies. Third-party HPLC and mass spectrometry testing on every batch.',
    winner: 'prescribed',
  },
  {
    category: 'Dosing',
    research: 'Self-determined based on internet forums. High risk of under-dosing or dangerous overdosing.',
    prescribed: 'Personalized dosing based on your weight, medical history, and treatment goals.',
    winner: 'prescribed',
  },
  {
    category: 'Support',
    research: 'No medical guidance. No one to call if side effects occur.',
    prescribed: '24/7 access to your care team. Regular check-ins. Dose adjustments as needed.',
    winner: 'prescribed',
  },
  {
    category: 'Legality',
    research: 'Research chemicals are not approved for human use in South Africa. Legal gray area.',
    prescribed: 'Fully legal. Prescribed by licensed SA doctors and dispensed by licensed pharmacies.',
    winner: 'prescribed',
  },
  {
    category: 'Cost',
    research: 'Lower upfront cost, but high risk of wasted product, health complications, or emergency care.',
    prescribed: 'Transparent monthly pricing that includes consultation, medication, testing, and support.',
    winner: 'prescribed',
  },
]

const risks = [
  'Contaminated or fake products from unverified overseas suppliers',
  'Incorrect peptide identity — you may not be injecting what you think',
  'No sterility testing leading to infections or abscesses',
  'Dangerous dosing without medical knowledge of contraindications',
  'No recourse if something goes wrong — no doctor, no pharmacy, no accountability',
  'Potential legal issues for importing unapproved research chemicals',
]

const benefits = [
  'Physician-prescribed and personally monitored',
  'Pharmaceutical-grade, third-party tested compounds',
  'Personalized dosing based on your unique biology',
  '24/7 support from licensed medical professionals',
  'Full legal compliance with SAHPRA regulations',
  'Cold-chain delivery with temperature verification',
]

export default function ResearchVsPrescribed() {
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
              Safety & Quality
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Why Peptide South Africa?<br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Research vs. Prescribed
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8 max-w-2xl">
              The internet is full of "research chemicals" sold without oversight. Here is why physician-prescribed peptide therapy is the only choice for your health.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Choose the Safe Route
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pharmacy-standards" className="btn-ghost">
                Our Pharmacy Standards
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Comparison</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Research Chemicals vs. Physician-Prescribed</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">The difference is not just quality — it is your safety.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold text-dark-900 text-lg">Category</div>
                  <div className="font-semibold text-red-600 text-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Research Chemicals
                  </div>
                  <div className="font-semibold text-emerald-600 text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Physician-Prescribed
                  </div>
                </div>
                <div className="space-y-3">
                  {comparisonRows.map((row) => (
                    <div key={row.category} className="grid grid-cols-3 gap-4 rounded-xl bg-dark-50 p-4 items-start">
                      <div className="font-semibold text-dark-900 pt-0.5">{row.category}</div>
                      <div className="text-sm text-dark-600 leading-relaxed">{row.research}</div>
                      <div className="text-sm text-dark-800 leading-relaxed font-medium">{row.prescribed}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Risks */}
      <section className="section-padding bg-red-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-red-900">Risks of Research Chemicals</h2>
              </div>
              <p className="text-red-800 leading-relaxed mb-6">
                Buying unregulated peptides online may seem convenient, but the risks are significant and well-documented. Here is what you are really getting when you skip the physician.
              </p>
              <div className="space-y-4">
                {risks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-red-800 text-sm leading-relaxed">{risk}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img
                  src={productImages.whooshBottle}
                  alt="Research chemicals warning"
                  className="w-full h-full object-contain rounded-2xl"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Benefits of Prescribed */}
      <section className="section-padding bg-emerald-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <img 
                src={productImages.tirzepatideBottle} 
                alt="Compounded Tirzepatide" 
                className="w-full h-80 lg:h-96 object-contain rounded-2xl"
                loading="lazy"
              />
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Benefits of Prescribed Therapy</h2>
              </div>
              <p className="text-emerald-800 leading-relaxed mb-6">
                When you choose Peptide South Africa, you are not just buying a peptide — you are entering a physician-guided healthcare relationship designed to keep you safe and deliver results.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-800 text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <AnimatedSection className="text-center">
            <Quote className="w-10 h-10 text-primary-400 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-bold text-dark-900 leading-relaxed mb-6">
              &ldquo;I tried research chemicals first. The side effects were terrifying, and I had no one to call. Switching to Peptide South Africa was the best decision — I finally felt safe, and the results were actually better.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">JM</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-dark-900">James M.</div>
                <div className="text-sm text-dark-500">Cape Town — Tirzepatide Patient</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-700">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <Shield className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose the Safe Route</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Your health is not an experiment. Get physician-prescribed, pharmacy-compounded, third-party tested peptides from South Africa's most trusted peptide therapy platform.
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
