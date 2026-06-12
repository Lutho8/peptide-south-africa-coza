import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Check,
  ChevronDown,
  Shield,
  Truck,
  ArrowRight,
  Stethoscope,
  FlaskConical,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Benefit {
  icon: React.ComponentType<any>
  title: string
  description: string
}

interface PricingPlan {
  name: string
  price: string
  period: string
  highlight?: boolean
  features: string[]
}

interface FAQItem {
  question: string
  answer: string
}

interface RelatedProduct {
  name: string
  path: string
  category: string
  categoryBadgeClass: string
}

interface ProductPageTemplateProps {
  name: string
  category: string
  categoryBadgeClass: string
  description: string
  price: string
  priceSubtext: string
  benefits: Benefit[]
  scienceParagraphs: string[]
  scienceBullets: string[]
  pricingPlans: PricingPlan[]
  faqItems: FAQItem[]
  relatedProducts: RelatedProduct[]
}

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ProductHero({
  name,
  category,
  categoryBadgeClass,
  description,
  price,
  priceSubtext,
}: {
  name: string
  category: string
  categoryBadgeClass: string
  description: string
  price: string
  priceSubtext: string
}) {
  return (
    <section className="bg-gradient-to-b from-primary-50/50 to-white">
      <div className="container-main py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto lg:mx-0 max-w-[400px]">
              <div className="aspect-[4/5] w-full bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl shadow-xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/60 flex items-center justify-center">
                    <FlaskConical className="w-10 h-10 text-primary-500" />
                  </div>
                  <p className="text-dark-400 text-sm font-medium">{name}</p>
                </div>
              </div>
              {/* Decorative blob */}
              <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-primary-200/50 rounded-full blur-2xl" />
              <div className="absolute -z-10 -bottom-6 -left-6 w-40 h-40 bg-accent-200/40 rounded-full blur-2xl" />
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <span
              className={cn(
                'inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4',
                categoryBadgeClass
              )}
            >
              {category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight mb-4">
              {name}
            </h1>

            <p className="text-base md:text-lg text-dark-500 max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed">
              {description}
            </p>

            <div className="mb-8">
              <p className="text-3xl font-bold text-dark-900">{price}</p>
              <p className="text-sm text-dark-400 mt-1">{priceSubtext}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link to="/pricing" className="btn-primary">
                Start Today
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() =>
                  document
                    .getElementById('product-details')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="btn-secondary"
              >
                Learn More
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-primary-500" />
                </div>
                <span>Physician-Supervised</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-500" />
                </div>
                <span>SAHPRA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-primary-500" />
                </div>
                <span>Free Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ProductBenefits({ name, benefits }: { name: string; benefits: Benefit[] }) {
  return (
    <section id="product-details" className="bg-white section-padding">
      <div className="container-main">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-900 mb-4">
            Why {name}?
          </h2>
          <p className="text-dark-500 max-w-2xl mx-auto">
            Discover the powerful benefits that make {name} a leading choice for patients and
            physicians alike.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className={cn(
            'grid gap-6',
            benefits.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : benefits.length === 4
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="card-hover p-6 md:p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <b.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-dark-900 mb-2">{b.title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorks({ name }: { name: string }) {
  const steps = [
    {
      num: '01',
      title: 'Consultation & Prescription',
      desc: 'Complete a medical questionnaire and consult with a licensed physician who will evaluate your health history and goals.',
    },
    {
      num: '02',
      title: 'Personalized Dosing Protocol',
      desc: 'Receive a tailored treatment plan with precise dosing instructions, injection guidance, and a schedule designed for your body.',
    },
    {
      num: '03',
      title: 'Ongoing Monitoring & Support',
      desc: 'Track your progress with regular check-ins, dosage adjustments, and direct access to our clinical support team.',
    },
  ]

  return (
    <section className="bg-dark-50 section-padding">
      <div className="container-main">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-900 mb-4">
            How {name} Works
          </h2>
          <p className="text-dark-500 max-w-2xl mx-auto">
            Our physician-guided process ensures safe, effective, and personalized treatment from
            day one.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
              className="relative text-center"
            >
              {/* Connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-200 to-transparent" />
              )}

              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <span className="text-white font-bold text-lg">{step.num}</span>
              </div>

              <h3 className="text-lg font-semibold text-dark-900 mb-3">{step.title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductScience({
  name,
  paragraphs,
  bullets,
}: {
  name: string
  paragraphs: string[]
  bullets: string[]
}) {
  return (
    <section className="bg-white section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-900 mb-6">
              The Science Behind {name}
            </h2>

            <div className="space-y-4 mb-8">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-dark-500 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <ul className="space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-dark-600 text-sm md:text-base">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Image placeholder */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scaleIn}
            className="relative"
          >
            <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl shadow-lg flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/60 flex items-center justify-center">
                  <FlaskConical className="w-12 h-12 text-primary-500" />
                </div>
                <p className="text-dark-400 font-medium">Clinical Research</p>
              </div>
            </div>
            <div className="absolute -z-10 -top-8 -right-8 w-40 h-40 bg-primary-200/40 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-accent-200/30 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ProductPricing({ plans }: { plans: PricingPlan[] }) {
  return (
    <section className="bg-dark-50 section-padding">
      <div className="container-main">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-dark-500 max-w-2xl mx-auto">
            Flexible plans designed to fit your goals and budget. All plans include physician
            oversight and free delivery.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={cn(
                'relative rounded-2xl p-6 md:p-8 transition-all duration-300',
                plan.highlight
                  ? 'bg-white border-2 border-primary-500 shadow-xl shadow-primary-500/10 scale-[1.02] md:scale-105'
                  : 'bg-white border border-dark-100 shadow-sm hover:shadow-md'
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-dark-900 mb-2">{plan.name}</h3>
              <div className="mb-1">
                <span className="text-3xl font-bold text-dark-900">{plan.price}</span>
              </div>
              <p className="text-sm text-dark-400 mb-6">{plan.period}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-dark-600">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/pricing"
                className={cn(
                  'block w-full text-center py-3 rounded-full font-semibold text-sm transition-all duration-200',
                  plan.highlight
                    ? 'btn-primary'
                    : 'btn-secondary'
                )}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ProductFAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-white section-padding">
      <div className="container-main max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-dark-500">
            Everything you need to know before starting your peptide journey.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {items.map((item, i) => (
            <motion.div key={i} variants={fadeIn} className="border-b border-dark-100 last:border-0">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-4 px-2 text-left"
              >
                <span className="font-semibold text-dark-900 pr-4">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-dark-400" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 px-2 text-dark-500 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CTABanner({ name }: { name: string }) {
  return (
    <section className="bg-gradient-primary">
      <div className="container-main py-16 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to start your {name} journey?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Take the first step toward a healthier, more vibrant you. Speak with a physician today
            and get your personalized protocol.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-primary-700 font-semibold text-sm hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            Start Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  return (
    <section className="bg-dark-50 section-padding">
      <div className="container-main">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4">
            You may also like
          </h2>
          <p className="text-dark-500">
            Explore other physician-supervised peptide protocols.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {products.map((p, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Link
                to={p.path}
                className="block card-hover p-6 group"
              >
                <span
                  className={cn(
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4',
                    p.categoryBadgeClass
                  )}
                >
                  {p.category}
                </span>
                <h3 className="text-lg font-semibold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-primary-600 font-medium">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Template                                                      */
/* ------------------------------------------------------------------ */

export default function ProductPageTemplate({
  name,
  category,
  categoryBadgeClass,
  description,
  price,
  priceSubtext,
  benefits,
  scienceParagraphs,
  scienceBullets,
  pricingPlans,
  faqItems,
  relatedProducts,
}: ProductPageTemplateProps) {
  return (
    <div className="pt-16">
      <ProductHero
        name={name}
        category={category}
        categoryBadgeClass={categoryBadgeClass}
        description={description}
        price={price}
        priceSubtext={priceSubtext}
      />
      <ProductBenefits name={name} benefits={benefits} />
      <HowItWorks name={name} />
      <ProductScience
        name={name}
        paragraphs={scienceParagraphs}
        bullets={scienceBullets}
      />
      <ProductPricing plans={pricingPlans} />
      <ProductFAQ items={faqItems} />
      <CTABanner name={name} />
      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
