import ProductPageTemplate from '../components/products/ProductPageTemplate'
import { productImages } from '../lib/assets'
import {
  Zap,
  Dumbbell,
  TrendingDown,
  Moon,
  HeartPulse,
} from 'lucide-react'

export default function ProductSermorelin() {
  return (
    <ProductPageTemplate
      name="Sermorelin"
      category="LONGEVITY & RECOVERY"
      categoryBadgeClass="bg-emerald-100 text-emerald-700"
      description="A growth hormone-releasing peptide that stimulates natural HGH production for muscle growth, fat loss, and recovery."
      price="From R1,750/month"
      priceSubtext="or R175 per dose"
      heroImage={productImages.sermorelinVial}
      scienceImage={productImages.sermorelinVial}
      benefits={[
        {
          icon: Zap,
          title: 'Natural HGH Boost',
          description: 'Stimulates your pituitary gland to produce its own growth hormone, maintaining natural rhythms and feedback loops.',
        },
        {
          icon: Dumbbell,
          title: 'Muscle Growth',
          description: 'Supports lean muscle hypertrophy and strength gains when combined with resistance training.',
        },
        {
          icon: TrendingDown,
          title: 'Fat Reduction',
          description: 'Promotes lipolysis and improved body composition by shifting metabolism toward fat burning.',
        },
        {
          icon: Moon,
          title: 'Better Sleep',
          description: 'Many users report deeper, more restorative sleep with improved REM and slow-wave sleep cycles.',
        },
        {
          icon: HeartPulse,
          title: 'Faster Recovery',
          description: 'Accelerates tissue repair, reduces inflammation, and shortens recovery time between workouts.',
        },
      ]}
      scienceParagraphs={[
        'Sermorelin is a synthetic analog of growth hormone-releasing hormone (GHRH), the natural signaling molecule that tells your pituitary gland to produce human growth hormone (HGH). Unlike synthetic HGH injections, Sermorelin works with your body\'s own endocrine system, preserving natural feedback loops and pulsatile release patterns.',
        'This approach avoids the risks associated with exogenous HGH, such as joint pain, fluid retention, and potential insulin resistance. By stimulating natural production, Sermorelin supports lean muscle growth, fat metabolism, bone density, sleep quality, and immune function in a physiologically balanced way.',
      ]}
      scienceBullets={[
        'Synthetic GHRH analog that stimulates natural HGH secretion',
        'Preserves pituitary feedback loops and pulsatile release',
        'Supports lean muscle growth and improved body composition',
        'Enhances sleep quality, recovery, and immune function',
        'Safer alternative to synthetic HGH with fewer side effects',
      ]}
      pricingPlans={[
        {
          name: 'Starter',
          price: 'R1,750',
          period: 'per month (1 month supply)',
          features: [
            'Physician consultation & prescription',
            'Compounded Sermorelin vials',
            'Injection supplies & guide',
            'Free shipping nationwide',
            'Email support',
          ],
        },
        {
          name: 'Popular',
          price: 'R4,725',
          period: 'total (3 month supply — save 10%)',
          highlight: true,
          features: [
            'Everything in Starter',
            '3-month growth protocol',
            'Monthly progress check-ins',
            'Dose optimization',
            'Priority support',
          ],
        },
        {
          name: 'Best Value',
          price: 'R8,400',
          period: 'total (6 month supply — save 20%)',
          features: [
            'Everything in Popular',
            '6-month transformation protocol',
            'Bi-monthly physician reviews',
            'Training & nutrition guidance',
            'VIP phone & email support',
          ],
        },
      ]}
      faqItems={[
        {
          question: 'How is Sermorelin different from synthetic HGH?',
          answer: 'Sermorelin stimulates your own pituitary to produce natural HGH, preserving your body\'s feedback mechanisms. Synthetic HGH floods the system with exogenous hormone, which can suppress natural production and carries higher risks of side effects like joint pain and fluid retention.',
        },
        {
          question: 'What is the dosing protocol?',
          answer: 'Sermorelin is typically injected subcutaneously before bed, as natural HGH production peaks during sleep. Dosing ranges from 200-500 mcg nightly, personalized by your physician based on age, body composition, and goals.',
        },
        {
          question: 'Are there any side effects?',
          answer: 'Sermorelin is generally very well-tolerated. Some patients report mild flushing, headache, or injection-site irritation initially. These typically resolve within the first week. Because it stimulates natural production, side effects are far less common than with synthetic HGH.',
        },
        {
          question: 'Who should use Sermorelin?',
          answer: 'Sermorelin is ideal for adults over 30 experiencing declining energy, reduced muscle mass, increased body fat, poor sleep, or slow recovery. It is also popular among athletes and fitness enthusiasts seeking natural performance enhancement.',
        },
        {
          question: 'How long until I see results?',
          answer: 'Most patients notice improved sleep quality within the first 2 weeks. Changes in body composition typically become visible around 6-8 weeks, with significant results by month 3-4. Full benefits continue to build over 6 months of consistent use.',
        },
      ]}
      relatedProducts={[
        {
          name: 'NAD+',
          path: '/products/nad',
          category: 'LONGEVITY & RECOVERY',
          categoryBadgeClass: 'bg-emerald-100 text-emerald-700',
        },
        {
          name: 'Glutathione',
          path: '/products/glutathione',
          category: 'RECOVERY & WELLNESS',
          categoryBadgeClass: 'bg-blue-100 text-blue-700',
        },
      ]}
    />
  )
}
