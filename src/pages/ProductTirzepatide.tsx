import ProductPageTemplate from '../components/products/ProductPageTemplate'
import {
  Zap,
  Shield,
  Activity,
  TrendingUp,
} from 'lucide-react'

export default function ProductTirzepatide() {
  return (
    <ProductPageTemplate
      name="Compounded Tirzepatide"
      category="WEIGHT LOSS"
      categoryBadgeClass="bg-purple-100 text-purple-700"
      description="A dual-action GLP-1 + GIP receptor agonist for advanced weight management. The most effective peptide for sustainable fat loss."
      price="From R2,950/month"
      priceSubtext="or R295 per dose"
      benefits={[
        {
          icon: Zap,
          title: 'Rapid Weight Loss',
          description: 'Clinical trials demonstrate up to 22.5% body weight reduction, making it the most effective peptide for fat loss.',
        },
        {
          icon: Shield,
          title: 'Appetite Suppression',
          description: 'Dual hormone targeting significantly reduces hunger signals and food cravings throughout the day.',
        },
        {
          icon: Activity,
          title: 'Improved Metabolic Health',
          description: 'Enhances insulin sensitivity and glucose metabolism, supporting overall metabolic function.',
        },
        {
          icon: TrendingUp,
          title: 'Sustainable Results',
          description: 'Designed for long-term use with physician oversight to maintain healthy weight for life.',
        },
      ]}
      scienceParagraphs={[
        'Tirzepatide mimics two natural hormones — GLP-1 (glucagon-like peptide-1) and GIP (glucose-dependent insulinotropic polypeptide) — that regulate appetite, insulin secretion, and energy metabolism. By activating both receptor pathways simultaneously, it delivers superior metabolic effects compared to single-hormone agonists.',
        'Clinical trials published in leading medical journals show that Tirzepatide achieves up to 22.5% body weight reduction in adults with obesity. The compound is formulated in a South African SAHPRA-registered compounding pharmacy under strict quality controls.',
      ]}
      scienceBullets={[
        'Dual GLP-1 + GIP receptor activation for enhanced efficacy',
        'Up to 22.5% body weight reduction in clinical trials',
        'Improves glycemic control and insulin sensitivity',
        'Reduces visceral fat and cardiovascular risk markers',
        'Compounded under SAHPRA-compliant pharmacy standards',
      ]}
      pricingPlans={[
        {
          name: 'Starter',
          price: 'R2,950',
          period: 'per month (1 month supply)',
          features: [
            'Physician consultation & prescription',
            'Compounded Tirzepatide vials',
            'Injection supplies & guide',
            'Free shipping nationwide',
            'Email support',
          ],
        },
        {
          name: 'Popular',
          price: 'R7,950',
          period: 'total (3 month supply — save 10%)',
          highlight: true,
          features: [
            'Everything in Starter',
            '3-month personalized protocol',
            'Monthly progress check-ins',
            'Dose adjustment as needed',
            'Priority support',
          ],
        },
        {
          name: 'Best Value',
          price: 'R13,950',
          period: 'total (6 month supply — save 20%)',
          features: [
            'Everything in Popular',
            '6-month sustained protocol',
            'Bi-monthly physician reviews',
            'Nutritional guidance included',
            'VIP phone & email support',
          ],
        },
      ]}
      faqItems={[
        {
          question: 'What is the dosing schedule for Tirzepatide?',
          answer: 'Tirzepatide follows a gradual titration schedule starting at a low dose once weekly, typically increasing every 4 weeks based on your physician\'s guidance and your body\'s response. Most patients reach their maintenance dose within 12-16 weeks.',
        },
        {
          question: 'How do I inject Tirzepatide?',
          answer: 'Tirzepatide is administered as a simple subcutaneous injection — just under the skin — into the abdomen, thigh, or upper arm. We provide detailed video guides, sterile syringes, and 24/7 support to ensure you feel confident with self-injection.',
        },
        {
          question: 'What are the common side effects?',
          answer: 'The most common side effects are mild gastrointestinal symptoms such as nausea, diarrhea, or constipation, especially during the first few weeks. These typically resolve as your body adjusts. Your physician will monitor you closely and adjust dosing if needed.',
        },
        {
          question: 'Can I combine Tirzepatide with Semaglutide?',
          answer: 'No, Tirzepatide and Semaglutide should not be used together as they work on similar pathways. Your physician will recommend the best option for your individual health profile and goals.',
        },
        {
          question: 'How long until I see results?',
          answer: 'Most patients begin to notice reduced appetite within the first 1-2 weeks. Visible weight loss typically starts around weeks 4-8, with significant results appearing by month 3. Individual results vary based on diet, exercise, and adherence.',
        },
      ]}
      relatedProducts={[
        {
          name: 'Compounded Semaglutide',
          path: '/products/compounded-semaglutide',
          category: 'WEIGHT LOSS',
          categoryBadgeClass: 'bg-purple-100 text-purple-700',
        },
        {
          name: 'NAD+',
          path: '/products/nad',
          category: 'LONGEVITY & RECOVERY',
          categoryBadgeClass: 'bg-emerald-100 text-emerald-700',
        },
      ]}
    />
  )
}
