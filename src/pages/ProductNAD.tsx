import ProductPageTemplate from '../components/products/ProductPageTemplate'
import {
  Zap,
  Shield,
  Brain,
  Clock,
} from 'lucide-react'

export default function ProductNAD() {
  return (
    <ProductPageTemplate
      name="NAD+"
      category="LONGEVITY & RECOVERY"
      categoryBadgeClass="bg-emerald-100 text-emerald-700"
      description="The molecule your body makes less of every year. NAD+ supports cellular energy, DNA repair, and healthy aging."
      price="From R1,950/month"
      priceSubtext="Available as Injection, Nasal Spray, or Oral Capsules"
      benefits={[
        {
          icon: Zap,
          title: 'Cellular Energy',
          description: 'Boosts mitochondrial function to increase ATP production, fighting fatigue and enhancing physical stamina.',
        },
        {
          icon: Shield,
          title: 'DNA Repair',
          description: 'Activates PARP enzymes that detect and repair damaged DNA, protecting against cellular aging.',
        },
        {
          icon: Brain,
          title: 'Cognitive Function',
          description: 'Supports neuronal health, neurotransmitter balance, and mental clarity for peak brain performance.',
        },
        {
          icon: Clock,
          title: 'Anti-Aging Support',
          description: 'Activates sirtuins — the longevity genes — to promote cellular resilience and slow biological aging.',
        },
      ]}
      scienceParagraphs={[
        'NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in every living cell. It is essential for mitochondrial function, cellular metabolism, and DNA repair. Without adequate NAD+, cells cannot produce energy efficiently or maintain genomic integrity.',
        'Tragically, NAD+ levels decline by approximately 50% by age 40. This decline is linked to accelerated aging, cognitive decline, metabolic dysfunction, and reduced physical recovery. Supplementation with NAD+ directly restores these levels, activating sirtuins — the so-called longevity genes — and supporting PARP-mediated DNA repair pathways.',
      ]}
      scienceBullets={[
        'Essential coenzyme for mitochondrial ATP production',
        'Levels decline 50% by age 40, accelerating aging',
        'Activates sirtuins (SIRT1-7) for longevity signaling',
        'Supports PARP enzymes for DNA damage repair',
        'Improves neuronal function and neuroplasticity',
      ]}
      pricingPlans={[
        {
          name: 'Starter',
          price: 'R1,950',
          period: 'per month (1 month supply)',
          features: [
            'Physician consultation & prescription',
            'NAD+ in your chosen format',
            'Dosing protocol & guidance',
            'Free shipping nationwide',
            'Email support',
          ],
        },
        {
          name: 'Popular',
          price: 'R5,265',
          period: 'total (3 month supply — save 10%)',
          highlight: true,
          features: [
            'Everything in Starter',
            '3-month longevity protocol',
            'Monthly wellness check-ins',
            'Protocol optimization',
            'Priority support',
          ],
        },
        {
          name: 'Best Value',
          price: 'R9,360',
          period: 'total (6 month supply — save 20%)',
          features: [
            'Everything in Popular',
            '6-month anti-aging protocol',
            'Bi-monthly physician reviews',
            'Lifestyle optimization guide',
            'VIP phone & email support',
          ],
        },
      ]}
      faqItems={[
        {
          question: 'Should I choose injection, nasal spray, or oral capsules?',
          answer: 'Injections provide the highest bioavailability and fastest results. Nasal spray offers good absorption with convenience. Oral capsules are the easiest to use but have lower bioavailability. Your physician will recommend the best option based on your goals and lifestyle.',
        },
        {
          question: 'How often should I take NAD+?',
          answer: 'Injection protocols typically range from 2-3 times per week. Nasal spray is often used daily. Oral capsules are taken once or twice daily. Your exact schedule will be personalized by your physician based on your health status and goals.',
        },
        {
          question: 'What is the difference between NAD+ and NMN?',
          answer: 'NAD+ is the active coenzyme your cells use directly. NMN (Nicotinamide Mononucleotide) is a precursor that must be converted into NAD+ inside the cell. NAD+ supplementation delivers the molecule directly, bypassing conversion steps for faster, more reliable results.',
        },
        {
          question: 'Are there any side effects?',
          answer: 'NAD+ is generally well-tolerated. Some patients experience mild flushing, warmth, or slight nausea at higher doses, which usually resolves quickly. Your physician will start you at an appropriate dose and monitor your response.',
        },
        {
          question: 'Is NAD+ safe for long-term use?',
          answer: 'Yes, NAD+ is safe for long-term use. As a molecule your body naturally produces, supplementation simply restores declining levels. Many patients use NAD+ continuously as part of a longevity and wellness protocol.',
        },
      ]}
      relatedProducts={[
        {
          name: 'Sermorelin',
          path: '/products/sermorelin',
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
