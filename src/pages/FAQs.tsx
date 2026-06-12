import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import FAQAccordion from '../components/support/FAQAccordion';

const categories = [
  'All',
  'General',
  'Dosing & Adherence',
  'Safety',
  'Peptide Types',
  'Practical',
  'Getting Started',
  'Access & Membership',
  'About',
];

const faqs = [
  {
    question: 'What are peptides?',
    answer: 'Peptides are short chains of amino acids that act as signaling molecules in the body. They instruct cells to perform specific functions, such as releasing hormones, repairing tissue, or burning fat. Unlike proteins, peptides are smaller and more targeted, making them powerful tools for precision medicine.',
    category: 'General',
  },
  {
    question: "What's the difference between peptides and proteins?",
    answer: 'Both peptides and proteins are made of amino acids, but peptides are significantly shorter—typically containing 2 to 50 amino acids, while proteins contain 50 or more. This smaller size allows peptides to be absorbed more easily and to interact with specific receptors with high precision.',
    category: 'General',
  },
  {
    question: 'How do I know which peptide is right for me?',
    answer: 'The best peptide for you depends on your health goals, medical history, and current biomarkers. During your consultation with a Ride The Tide physician, we review your objectives—whether weight loss, longevity, recovery, or performance—and recommend a protocol tailored to your needs.',
    category: 'General',
  },
  {
    question: 'What is the dosing schedule?',
    answer: 'Dosing schedules vary by peptide and individual protocol. Most weight-loss peptides are administered once weekly, while longevity and recovery peptides may be daily or several times per week. Your physician will provide a clear schedule and adjust it based on your response.',
    category: 'Dosing & Adherence',
  },
  {
    question: 'How do I administer injections?',
    answer: 'All injections are subcutaneous—administered into the fatty tissue just under the skin, typically in the abdomen or thigh. We provide detailed video guides, written instructions, and a sharps disposal kit. Most patients find the process quick and virtually painless.',
    category: 'Dosing & Adherence',
  },
  {
    question: 'What if I miss a dose?',
    answer: 'If you miss a dose, take it as soon as you remember unless it is close to your next scheduled dose. In that case, skip the missed dose and resume your normal schedule. Never double up without consulting your physician.',
    category: 'Dosing & Adherence',
  },
  {
    question: 'Are there any side effects?',
    answer: 'Like all medications, peptides can have side effects. The most common with GLP-1 agonists include mild nausea, decreased appetite, and occasional fatigue. These typically resolve within the first few weeks. Your physician will discuss all potential side effects and how to manage them.',
    category: 'Safety',
  },
  {
    question: 'Is peptide therapy safe long-term?',
    answer: 'When prescribed and supervised by qualified physicians, peptide therapy has a strong safety profile. Long-term studies on GLP-1 agonists and growth hormone secretagogues show sustained benefits with appropriate monitoring. Regular follow-ups ensure your protocol remains safe and effective over time.',
    category: 'Safety',
  },
  {
    question: 'What is a GLP-1 agonist?',
    answer: 'A GLP-1 agonist is a compound that mimics glucagon-like peptide-1, a hormone that regulates appetite and blood sugar. By activating GLP-1 receptors, these peptides reduce hunger, slow digestion, and improve insulin sensitivity—making them highly effective for weight management and metabolic health.',
    category: 'Peptide Types',
  },
  {
    question: 'What is a growth hormone secretagogue?',
    answer: 'Growth hormone secretagogues like sermorelin stimulate your pituitary gland to produce and release its own natural growth hormone. Unlike direct hormone replacement, this approach preserves your body\'s feedback mechanisms and reduces the risk of side effects associated with synthetic hormone use.',
    category: 'Peptide Types',
  },
  {
    question: 'How should I store my peptides?',
    answer: 'Most peptide vials should be refrigerated between 2°C and 8°C after reconstitution. Unreconstituted powders can often be stored at room temperature in a cool, dry place. Always follow the specific storage instructions provided with your medication.',
    category: 'Practical',
  },
  {
    question: 'Can I travel with my peptides?',
    answer: 'Yes, you can travel with your peptides. Keep them in their original packaging with prescription labels, and transport them in a cooler bag with ice packs if refrigeration is required. For international travel, carry a copy of your prescription and a letter from your physician.',
    category: 'Practical',
  },
  {
    question: 'How do I get started?',
    answer: 'Getting started is simple. Complete our online medical questionnaire, schedule a virtual consultation with one of our physicians, and receive your personalized protocol delivered to your door. The entire process takes less than a week from signup to first dose.',
    category: 'Getting Started',
  },
  {
    question: 'What does the consultation involve?',
    answer: 'Your consultation is a comprehensive video or phone call with a licensed South African physician. We review your health history, current medications, goals, and any concerns. Based on this, we design a personalized peptide protocol and answer all your questions.',
    category: 'Getting Started',
  },
  {
    question: 'How much does it cost?',
    answer: 'Pricing varies by protocol and peptide type. Our weight-loss programs start from approximately R2,500 per month, while longevity and recovery protocols may differ. Visit our Pricing page for a detailed breakdown, or ask during your consultation.',
    category: 'Access & Membership',
  },
  {
    question: 'Is there a subscription?',
    answer: 'Yes, most protocols are offered on a monthly subscription basis to ensure consistent supply and ongoing physician oversight. You can pause, adjust, or cancel your subscription at any time through your patient portal.',
    category: 'Access & Membership',
  },
  {
    question: 'What is Ride The Tide?',
    answer: 'Ride The Tide is South Africa\'s leading physician-guided peptide therapy platform. We combine cutting-edge peptide science with personalized medical oversight to help patients achieve their health, weight-loss, longevity, and recovery goals safely and effectively.',
    category: 'About',
  },
  {
    question: 'Who are the physicians?',
    answer: 'Our physician network consists of licensed South African doctors with specialized training in peptide therapy, metabolic medicine, and longevity. Every physician is registered with the Health Professions Council of South Africa (HPCSA) and follows strict clinical governance standards.',
    category: 'About',
  },
];

export default function FAQs() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-main py-16 md:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-center mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed">
              Everything you need to know about peptide therapy, our process, and getting started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b border-dark-100">
        <div className="container-main py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-dark-50 text-dark-600 hover:bg-dark-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding bg-dark-50">
        <div className="container-main max-w-4xl">
          <FAQAccordion items={faqs} activeCategory={activeCategory} />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-white border-t border-dark-100">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="w-7 h-7 text-primary-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-3">Still Have Questions?</h2>
            <p className="text-dark-500 mb-6">
              Our team is here to help. Reach out and we will get back to you within 24 hours.
            </p>
            <Link to="/contact-us" className="btn-primary inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
