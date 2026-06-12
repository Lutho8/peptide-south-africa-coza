import ProductPageTemplate from '../components/products/ProductPageTemplate'
import {
  CheckCircle,
  Heart,
  Activity,
  HeartPulse,
} from 'lucide-react'

export default function ProductSemaglutide() {
  return (
    <ProductPageTemplate
      name="Compounded Semaglutide"
      category="WEIGHT LOSS"
      categoryBadgeClass="bg-purple-100 text-purple-700"
      description="A GLP-1 receptor agonist for effective weight management. The gold standard in peptide-based weight loss."
      price="From R2,450/month"
      priceSubtext="or R245 per dose"
      benefits={[
        {
          icon: CheckCircle,
          title: 'Proven Weight Loss',
          description: 'Extensive clinical data shows 15-20% body weight reduction, establishing Semaglutide as the gold standard.',
        },
        {
          icon: Heart,
          title: 'Reduced Cravings',
          description: 'Suppresses appetite and food noise, making it easier to stick to healthier eating habits.',
        },
        {
          icon: Activity,
          title: 'Better Blood Sugar Control',
          description: 'Improves insulin sensitivity and stabilizes glucose levels, reducing metabolic disease risk.',
        },
        {
          icon: HeartPulse,
          title: 'Heart Health Support',
          description: 'Clinical studies show cardiovascular benefits including reduced risk of heart attack and stroke.',
        },
      ]}
      scienceParagraphs={[
        'Semaglutide is a GLP-1 receptor agonist that mimics the natural hormone glucagon-like peptide-1. It works by slowing gastric emptying, reducing appetite, and improving insulin sensitivity — creating a powerful metabolic shift that supports sustained weight loss.',
        'Originally developed for type 2 diabetes, Semaglutide has become the most widely prescribed weight-loss peptide globally. Clinical data from the STEP trials demonstrates 15-20% weight reduction in adults with obesity, with significant improvements in cardiovascular risk markers.',
      ]}
      scienceBullets={[
        'Activates GLP-1 receptors to slow gastric emptying and reduce appetite',
        'Clinical STEP trials show 15-20% body weight reduction',
        'Improves insulin sensitivity and glycemic control',
        'REDUCE cardiovascular outcomes trial demonstrated heart benefits',
        'Compounded by SAHPRA-registered pharmacy with quality assurance',
      ]}
      pricingPlans={[
        {
          name: 'Starter',
          price: 'R2,450',
          period: 'per month (1 month supply)',
          features: [
            'Physician consultation & prescription',
            'Compounded Semaglutide vials',
            'Injection supplies & guide',
            'Free shipping nationwide',
            'Email support',
          ],
        },
        {
          name: 'Popular',
          price: 'R6,615',
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
          price: 'R11,760',
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
          question: 'How is Semaglutide different from Tirzepatide?',
          answer: 'Semaglutide targets only the GLP-1 receptor, while Tirzepatide targets both GLP-1 and GIP receptors. Tirzepatide generally produces greater weight loss (up to 22.5% vs 15-20%), but Semaglutide has a longer track record and may be better tolerated by some patients.',
        },
        {
          question: 'What is the dosing protocol?',
          answer: 'Semaglutide is injected once weekly, starting at a low dose and titrating upward every 4 weeks under physician supervision. The gradual increase minimizes side effects and allows your body to adapt comfortably.',
        },
        {
          question: 'What are the side effects?',
          answer: 'Common side effects include nausea, vomiting, diarrhea, and constipation, particularly during the first month. These are usually mild and temporary. Rare but serious side effects will be discussed during your physician consultation.',
        },
        {
          question: 'Can I pause my treatment?',
          answer: 'Yes, you can pause treatment if needed, but it\'s best to discuss this with your physician. Appetite and weight may gradually return to baseline after stopping, so a maintenance plan is recommended for long-term results.',
        },
        {
          question: 'How should I store Semaglutide?',
          answer: 'Store Semaglutide vials in the refrigerator (2-8°C). Once opened, use within the timeframe specified by the pharmacy. Do not freeze. We provide detailed storage instructions with every shipment.',
        },
      ]}
      relatedProducts={[
        {
          name: 'Compounded Tirzepatide',
          path: '/products/compounded-tirzepatide',
          category: 'WEIGHT LOSS',
          categoryBadgeClass: 'bg-purple-100 text-purple-700',
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
