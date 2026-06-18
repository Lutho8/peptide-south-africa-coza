import ProductPageTemplate from '../components/products/ProductPageTemplate'
import { productImages } from '../lib/assets'
import {
  Shield,
  FlaskConical,
  Heart,
  Sparkles,
  Zap,
} from 'lucide-react'

export default function ProductGlutathione() {
  return (
    <ProductPageTemplate
      name="Glutathione"
      category="RECOVERY & WELLNESS"
      categoryBadgeClass="bg-blue-100 text-blue-700"
      description="The body's master antioxidant. Supports detoxification, immune function, skin health, and recovery."
      price="From R1,450/month"
      priceSubtext="or R145 per dose"
      heroImage={productImages.glutathioneVial}
      scienceImage={productImages.glutathioneVial}
      benefits={[
        {
          icon: Shield,
          title: 'Master Antioxidant',
          description: 'Neutralizes free radicals and oxidative stress at the cellular level, protecting every tissue in your body.',
        },
        {
          icon: FlaskConical,
          title: 'Liver Detoxification',
          description: 'Supports phase II liver detox pathways, helping your body eliminate toxins, heavy metals, and metabolic waste.',
        },
        {
          icon: Heart,
          title: 'Immune Support',
          description: 'Enhances immune cell function and helps regulate inflammation, keeping your defenses strong year-round.',
        },
        {
          icon: Sparkles,
          title: 'Skin Brightening',
          description: 'Clinically shown to reduce melanin production and promote an even, radiant complexion from within.',
        },
        {
          icon: Zap,
          title: 'Athletic Recovery',
          description: 'Reduces exercise-induced oxidative damage and muscle soreness, helping you train harder and recover faster.',
        },
      ]}
      scienceParagraphs={[
        'Glutathione is the most abundant intracellular antioxidant in the human body. Often called the master antioxidant, it neutralizes free radicals, supports phase II liver detoxification, and regenerates other antioxidants like vitamin C and vitamin E.',
        'Glutathione is synthesized in every cell from three amino acids: glutamine, cysteine, and glycine. However, stress, poor diet, aging, and environmental toxins deplete glutathione levels. Supplementation restores optimal levels, supporting immune function, skin clarity, detoxification, and post-exercise recovery.',
      ]}
      scienceBullets={[
        'Most abundant intracellular antioxidant in the body',
        'Neutralizes free radicals and reduces oxidative stress',
        'Supports phase II liver detoxification enzymes',
        'Regenerates vitamin C and vitamin E for extended antioxidant protection',
        'Reduces melanin synthesis for skin brightening effects',
      ]}
      pricingPlans={[
        {
          name: 'Starter',
          price: 'R1,450',
          period: 'per month (1 month supply)',
          features: [
            'Physician consultation & prescription',
            'Compounded Glutathione vials',
            'Injection supplies & guide',
            'Free shipping nationwide',
            'Email support',
          ],
        },
        {
          name: 'Popular',
          price: 'R3,915',
          period: 'total (3 month supply — save 10%)',
          highlight: true,
          features: [
            'Everything in Starter',
            '3-month wellness protocol',
            'Monthly progress check-ins',
            'Protocol optimization',
            'Priority support',
          ],
        },
        {
          name: 'Best Value',
          price: 'R6,960',
          period: 'total (6 month supply — save 20%)',
          features: [
            'Everything in Popular',
            '6-month detox & recovery protocol',
            'Bi-monthly physician reviews',
            'Skin health & wellness guide',
            'VIP phone & email support',
          ],
        },
      ]}
      faqItems={[
        {
          question: 'Should I choose injection or oral Glutathione?',
          answer: 'Injections offer significantly higher bioavailability because glutathione is poorly absorbed through the digestive tract. Oral forms are largely broken down by stomach acids. For therapeutic results, subcutaneous or intramuscular injection is the gold standard.',
        },
        {
          question: 'How often should I take Glutathione?',
          answer: 'Typical protocols range from 2-3 injections per week for general wellness, or more frequently for intensive detox or skin-brightening goals. Your physician will design a schedule tailored to your specific needs and objectives.',
        },
        {
          question: 'Are there any side effects?',
          answer: 'Glutathione is very safe and well-tolerated. Some patients may experience mild injection-site discomfort or temporary skin lightening with higher doses. Allergic reactions are rare but will be screened for during your consultation.',
        },
        {
          question: 'How long until I see skin benefits?',
          answer: 'Skin brightening effects typically begin to appear after 4-6 weeks of consistent use, with more noticeable results by 8-12 weeks. Results vary based on baseline melanin levels, dose, and individual metabolism.',
        },
        {
          question: 'Is Glutathione good for athletic performance?',
          answer: 'Yes. Glutathione reduces oxidative damage from intense exercise, decreases muscle soreness, and supports faster recovery between training sessions. Many elite athletes use glutathione as part of their recovery stack.',
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
          name: 'Compounded Semaglutide',
          path: '/products/compounded-semaglutide',
          category: 'WEIGHT LOSS',
          categoryBadgeClass: 'bg-purple-100 text-purple-700',
        },
      ]}
    />
  )
}
