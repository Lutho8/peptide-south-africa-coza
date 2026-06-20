import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, MessageCircle, ChevronDown, AlertTriangle, ArrowRight, Stethoscope, Shield, Scale, Globe, Banknote, Phone, Pill, Truck, Activity, FileText, Users } from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'

const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: HelpCircle, count: 7 },
  { id: 'medical-safety', name: 'Medical & Safety', icon: Stethoscope, count: 7 },
  { id: 'products-protocols', name: 'Products & Protocols', icon: Pill, count: 8 },
  { id: 'pricing-payments', name: 'Pricing & Payments', icon: Banknote, count: 7 },
  { id: 'delivery-shipping', name: 'Delivery & Shipping', icon: Truck, count: 6 },
  { id: 'medical-aid', name: 'Medical Aid & Insurance', icon: Activity, count: 6 },
  { id: 'sahpra-compliance', name: 'SAHPRA & Compliance', icon: Scale, count: 7 },
  { id: 'platform', name: 'Peptide South Africa Platform', icon: Users, count: 6 },
]

const faqs: Record<string, Array<{ question: string; answer: string }>> = {
  'getting-started': [
    { question: 'How do I start a peptide protocol with Peptide South Africa?', answer: 'Take our 2-minute online assessment at peptide-south-africa.com/assessment. An HPCSA-registered physician will review your health profile and determine if peptide therapy is appropriate. If approved, you will receive a personalized protocol and your first month\'s supply will be compounded and shipped to your door within 5–7 days.' },
    { question: 'Do I need a prescription?', answer: 'Yes. All peptide protocols require a prescription from an HPCSA-registered physician. This is a legal requirement under the Medicines and Related Substances Act, and it ensures your safety. Any website selling peptides without a prescription is operating illegally and putting your health at risk.' },
    { question: 'How long does the process take?', answer: 'Assessment takes 2 minutes. Physician review typically takes 24–48 hours. Pharmacy compounding and shipping takes 3–5 business days. Total time from assessment to first dose: 5–7 days.' },
    { question: 'Is there a consultation fee?', answer: 'The initial physician consultation is included in your first month\'s program fee (R850 value). Follow-up consultations are included in your monthly subscription. There are no hidden fees.' },
    { question: 'What if I am not approved for peptide therapy?', answer: 'If your physician determines that peptide therapy is not appropriate for your health profile, you receive a full refund of any prepaid fees. We may recommend alternative interventions such as lifestyle programs, nutritional coaching, or referrals to specialists.' },
    { question: 'Can I complete the assessment on WhatsApp instead of the website?', answer: 'Yes. We offer a WhatsApp-based assessment flow for patients who prefer messaging over web forms. Click the WhatsApp button on any page to start.' },
    { question: 'Do I need to visit a doctor in person?', answer: 'For most peptide protocols, an asynchronous telehealth assessment is sufficient. However, if you have complex medical conditions or the physician requires additional information, a video consultation may be requested. In rare cases, an in-person evaluation may be recommended before prescribing.' },
  ],
  'medical-safety': [
    { question: 'Are peptides safe?', answer: 'When prescribed by a qualified physician and compounded by a licensed pharmacy, peptides are generally safe. However, all medications carry risks. Our physicians screen for contraindications (thyroid cancer history, pancreatitis, pregnancy, drug interactions) and monitor you throughout treatment. Self-sourcing peptides from unregulated websites is dangerous and illegal.' },
    { question: 'What are the common side effects of GLP-1 agonists (semaglutide, tirzepatide)?', answer: 'Nausea, diarrhea, vomiting, and constipation are common in the first 2–4 weeks. These typically resolve as the body adapts. Our titration protocols start at low doses to minimize GI effects. Rare but serious side effects include pancreatitis and gallbladder disease — we monitor for these. Always report severe abdominal pain immediately.' },
    { question: 'Can I take peptides if I am on other medications?', answer: 'It depends. Our intake form collects all current medications, and our physicians review for interactions. Some peptides interact with diabetes medications, blood thinners, and certain heart medications. Never combine peptides with other drugs without physician approval. Bring a complete medication list to your assessment.' },
    { question: 'Are peptides safe during pregnancy or breastfeeding?', answer: 'No. GLP-1 agonists and most other peptides are contraindicated in pregnancy and breastfeeding. We require a negative pregnancy test before initiating therapy for women of childbearing potential. If you become pregnant during treatment, contact your physician immediately to discontinue.' },
    { question: 'What bloodwork do I need before starting?', answer: 'We recommend a baseline metabolic panel: fasting glucose, HbA1c, lipid panel, liver function, kidney function, thyroid panel, and inflammatory markers. Some programs include this in your first month; others require you to provide recent results. Your physician will specify exactly what is needed based on your protocol.' },
    { question: 'What happens if I experience side effects?', answer: 'Contact our clinical team immediately via WhatsApp or the app. For serious symptoms (severe abdominal pain, difficulty breathing, chest pain, jaundice), seek emergency care and notify us. For mild side effects (nausea, headache), we provide management tips and can adjust your dose. Dose adjustments are included in your subscription at no extra cost.' },
    { question: 'Will peptides affect my hormone levels?', answer: 'GH secretagogues (CJC-1295, Ipamorelin, Sermorelin) raise growth hormone and IGF-1. This is expected and monitored. GLP-1 agonists do not directly affect sex hormones but may improve insulin sensitivity, which can indirectly affect hormonal balance. Your physician will monitor relevant biomarkers.' },
  ],
  'products-protocols': [
    { question: 'What peptides do you offer?', answer: 'We offer physician-guided protocols using semaglutide, tirzepatide, retatrutide, BPC-157, TB-500, CJC-1295, Ipamorelin, Sermorelin, NAD+, MOTS-C, AOD-9604, Tesamorelin, GHK-Cu, Glutathione, Epitalon, and others. Availability depends on physician assessment and clinical indication. We do not offer every peptide for every patient — we offer the right peptide for your specific health profile.' },
    { question: 'Do you sell individual vials?', answer: 'No. We sell personalized protocols, not individual products. Each protocol is designed for your specific health goals, contraindications, and biomarkers. This is both safer and more effective than self-directed dosing. The protocol approach ensures proper dosing, cycling, monitoring, and physician oversight.' },
    { question: 'What is the difference between semaglutide and tirzepatide?', answer: 'Semaglutide is a GLP-1 receptor agonist. Tirzepatide activates both GLP-1 and GIP receptors. Clinical trials show tirzepatide produces greater weight loss (20% vs 15% average), but semaglutide may have better GI tolerance for some patients. Your physician will recommend the appropriate option based on your profile.' },
    { question: 'How long do I need to stay on a protocol?', answer: 'For weight loss, 12–16 weeks is typical for active loss, followed by a maintenance protocol. For longevity and recovery, ongoing subscription protocols are common with quarterly reviews. For sports performance, protocols are periodized to training cycles (build, peak, off-season). Your physician will recommend a timeline based on your goals and response.' },
    { question: 'Can I switch programs?', answer: 'Yes. If your goals change — for example, from weight loss to longevity — your physician can redesign your protocol at your monthly check-in. Program changes are reviewed for safety and may require additional bloodwork. There is no penalty for switching programs.' },
    { question: 'What is compounded medication?', answer: 'Compounded medications are customized preparations made by licensed pharmacies for individual patients. When a commercial product is unavailable, unsuitable, or too expensive, a compounding pharmacy can prepare a specific formulation, dose, or combination. Compounded peptides are legal in South Africa when prescribed by a physician and prepared by a SAPC-registered pharmacy. They are not SAHPRA-approved brand products, but they are quality-tested and physician-directed.' },
    { question: 'Are compounded peptides as good as brand-name?', answer: 'When prepared by a licensed pharmacy with quality APIs and proper testing, compounded peptides are clinically equivalent to brand-name products. The active ingredient is the same. The difference is in the packaging, branding, and price. However, quality varies by pharmacy — which is why we only work with verified, SAPC-registered pharmacies with independent testing.' },
  ],
  'pricing-payments': [
    { question: 'What payment methods do you accept?', answer: 'PayFast (credit/debit card, instant EFT, SnapScan), Ozow (instant bank EFT from all major South African banks), NowPayments (cryptocurrency: BTC, ETH, USDT), and medical aid reimbursement invoices. We do not accept cash on delivery.' },
    { question: 'Is peptide therapy covered by medical aid?', answer: 'Some medical aids cover GLP-1 agonists for type 2 diabetes under Chronic Illness Benefit. Saxenda (for weight management) may be covered from day-to-day benefits. We provide itemized invoices for reimbursement claims. Contact your medical aid to confirm coverage. Discovery Health covers Ozempic and Mounjaro for T2D when clinical criteria are met.' },
    { question: 'Can I pause my subscription?', answer: 'Yes. You can pause for up to 3 months without penalty. Reactivate anytime via your patient portal or WhatsApp. Your protocol and prescription remain on file. A brief physician check-in may be required if you pause for more than 2 months.' },
    { question: 'Is there a refund policy?', answer: 'If you are not approved for therapy after assessment: full refund. If you experience an adverse reaction verified by our medical team: prorated refund. If you are dissatisfied with the clinical service within the first 30 days: case-by-case review. Refunds are processed within 5–7 business days to the original payment method.' },
    { question: 'Are there any hidden fees?', answer: 'No. Our pricing is fully transparent. Your monthly subscription includes: physician consultation, prescription, compounded medication, cold-chain delivery, weekly/monthly check-ins, app access, and biomarker tracking. Bloodwork panels are an additional cost if not included in your program. We never charge surprise fees.' },
  ],
  'delivery-shipping': [
    { question: 'Do you ship nationwide?', answer: 'Yes. We ship to all major cities and towns in South Africa via courier with cold-chain packaging. Delivery times: Cape Town 1–2 days, Johannesburg 2–3 days, Durban 2–3 days, other areas 3–5 days. We do not ship outside South Africa at this time.' },
    { question: 'How is the medication shipped?', answer: 'Peptides are temperature-sensitive. We ship in insulated packaging with ice packs and temperature monitoring strips. You will receive tracking information and storage instructions upon dispatch. All shipments are handled by professional couriers (not postal service) to ensure speed and reliability.' },
    { question: 'What if I am not home for delivery?', answer: 'We require a signature for first deliveries. If you miss delivery, the courier will attempt redelivery the next business day or hold at a local collection point. Subsequent deliveries can be left in a designated safe place if you confirm in writing. We recommend providing a work address if you are not home during business hours.' },
    { question: 'How do I store peptides during load shedding?', answer: 'Keep the refrigerator door closed during outages (maintains temperature for 2–4 hours). For extended outages (4+ hours), transfer peptides to a cooler bag with ice packs. Reconstituted peptides are stable for 4–6 hours at room temperature if sealed. Do not leave peptides in a hot car during summer. Consider a medical-grade cooler bag for frequent power outages.' },
    { question: 'Can I collect in person instead of delivery?', answer: 'Some partner compounding pharmacies offer in-person collection for patients who prefer it. This is useful for first-time patients who want to speak with a pharmacist about reconstitution and storage. Collection is available in Cape Town, Johannesburg, and Durban. Contact us to arrange.' },
  ],
  'medical-aid': [
    { question: 'Does Discovery Health cover Ozempic?', answer: 'Yes, for type 2 diabetes under Chronic Illness Benefit when clinical criteria are met. For weight loss: coverage is from day-to-day benefits or out-of-pocket.' },
    { question: 'Does Momentum cover Mounjaro?', answer: 'Yes, for type 2 diabetes under Chronic Illness Benefit when clinical criteria are met. For weight loss: day-to-day benefits only.' },
    { question: 'Can I submit a claim for compounded peptides?', answer: 'Compounded peptides are generally not covered by medical aid unless they are substitutes for registered products with medical necessity documentation. We provide itemized invoices for your own submission, but coverage is not guaranteed.' },
  ],
  'sahpra-compliance': [
    { question: 'Is Peptide South Africa legal?', answer: 'Yes. We operate in full compliance with the Medicines and Related Substances Act (Act 101 of 1965), POPIA (Protection of Personal Information Act), and all applicable South African healthcare regulations. All prescriptions are issued by HPCSA-registered physicians and filled by SAPC-registered pharmacies. We are a legitimate telehealth platform, not a gray-market vendor.' },
    { question: 'Are you on SAHPRA\'s warning list?', answer: 'No. Peptide South Africa is not associated with any of the vendors named by SAHPRA in 2024–2026 enforcement actions. We do not sell unauthorized or falsified products. We are a physician-guided clinical platform with licensed pharmacy partners.' },
    { question: 'What is SAHPRA?', answer: 'The South African Health Products Regulatory Authority (SAHPRA) is the statutory body responsible for regulating medicines, medical devices, and clinical trials in South Africa. They evaluate products for quality, safety, and efficacy before registration. In 2024–2026, SAHPRA began enforcing against unauthorized peptide sellers, naming specific websites on a public warning list.' },
    { question: 'What is the difference between your service and "research peptide" websites?', answer: '"Research peptide" websites sell unregistered chemicals with a disclaimer that they are "not for human consumption." These products are not evaluated by SAHPRA, may be falsified or contaminated, and their sale is illegal under Section 29 of the Medicines Act. Peptide South Africa provides physician-prescribed, pharmacy-compounded protocols with verified quality and ongoing medical oversight. The difference is clinical legitimacy, safety, and legal compliance.' },
    { question: 'Do I need to be a South African citizen?', answer: 'No. You need to be physically located in South Africa for delivery and be 18 years or older. You do not need to be a citizen. We require a valid South African address and phone number for delivery and clinical communication. If you are traveling to South Africa temporarily, we may not be able to provide ongoing care.' },
    { question: 'What is POPIA and how do you protect my data?', answer: 'POPIA is South Africa\'s data protection law. We encrypt all health data (AES-256 at rest, TLS 1.3 in transit), store it in South Africa, restrict access to authorized clinical staff only, and never sell or share your data with third parties except as necessary for your care (e.g., with the compounding pharmacy fulfilling your prescription). You have the right to access, correct, and delete your data.' },
    { question: 'Can my employer or medical aid see my prescription?', answer: 'No. Your medical information is confidential. We do not share prescription details with employers. We provide itemized invoices to you for medical aid reimbursement, but you choose what to submit. If your medical aid requires a motivation letter, we can provide one with your consent.' },
  ],
  'platform': [
    { question: 'What is the Peptide South Africa app?', answer: 'The Peptide South Africa Protocol Tracker (app.peptide-south-africa.com) is a dedicated mobile app for tracking your peptide protocol. Features include: dose reminders and logging, symptom and side effect tracking, body composition and measurement logging, biomarker trend visualization, direct messaging with your clinical team, protocol education, and Cape Town Peptide Club community access.' },
    { question: 'Is the app free?', answer: 'The app is free for all Peptide South Africa patients. Non-patients can subscribe to the app-only tier for R99/month to access tracking, education, and community features without medication.' },
    { question: 'How do I download the app?', answer: 'Download from the App Store (iOS) or Google Play Store (Android). Search for "Peptide South Africa Protocol Tracker." After downloading, log in with the same email you used for your assessment. Your protocol will sync automatically.' },
    { question: 'Can I use the app if I am not a Peptide South Africa patient?', answer: 'Yes, via the App Only subscription (R99/month). You can track any peptide protocol, access educational content, and join the community. However, you will not have access to our clinical team or physician consultations without an active program subscription.' },
    { question: 'What if I have a question at 2 AM?', answer: 'You can send a message via the app or WhatsApp at any time. For non-urgent questions, we respond during business hours. For urgent clinical concerns, we have an on-call physician for after-hours emergencies. For life-threatening symptoms, call emergency services (10111 or 112) immediately.' },
    { question: 'How do I join the Cape Town Peptide Club?', answer: 'Visit capetownpeptideclub.co.za and sign up for free. Premium membership (R150/month) includes in-person meetups, priority Q&A, bloodwork discounts, and affiliate program access. All Peptide South Africa patients receive a complimentary 3-month premium membership.' },
  ],
}

function CategoryAccordion({ categoryId, name, icon: Icon, isOpen, onToggle }: { categoryId: string; name: string; icon: React.ElementType; isOpen: boolean; onToggle: () => void }) {
  const items = faqs[categoryId] || []
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-dark-100 overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-dark-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <span className="font-semibold text-dark-900">{name}</span>
            <span className="text-dark-400 text-sm ml-2">({items.length} questions)</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-dark-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              {items.map((item, idx) => {
                const isQOpen = openIndex === idx
                return (
                  <div key={idx} className="border-b border-dark-100 last:border-0">
                    <button
                      onClick={() => setOpenIndex(isQOpen ? null : idx)}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="font-medium text-dark-800 text-sm pr-4">{item.question}</span>
                      <ChevronDown className={`w-4 h-4 text-dark-400 flex-shrink-0 transition-transform duration-300 ${isQOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isQOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 text-dark-500 text-sm leading-relaxed">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string>('getting-started')

  const totalQuestions = Object.values(faqs).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-main relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed">
              Everything you need to know about peptide therapy, telehealth, and Peptide South Africa. Can\'t find your answer? <a href="#" className="underline">WhatsApp us</a> or <a href="mailto:hello@peptide-south-africa.com" className="underline">email our clinical team</a>.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Medical Disclaimer Banner */}
      <section className="bg-red-50 border-b border-red-100">
        <div className="container-main py-4">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Medical Disclaimer</p>
              <p>The information on this page is for educational purposes only and does not constitute medical advice. Peptide therapy requires a prescription and physician oversight. Always consult an HPCSA-registered physician before starting any new treatment. If you experience a medical emergency, call 10111 or 112 immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="section-padding bg-dark-50">
        <div className="container-main max-w-4xl">
          <AnimatedSection className="text-center mb-8">
            <p className="text-dark-500 text-sm">{totalQuestions} questions organized into {categories.length} categories</p>
          </AnimatedSection>
          {categories.map((cat) => (
            <CategoryAccordion
              key={cat.id}
              categoryId={cat.id}
              name={cat.name}
              icon={cat.icon}
              isOpen={openCategory === cat.id}
              onToggle={() => setOpenCategory(openCategory === cat.id ? '' : cat.id)}
            />
          ))}
        </div>
      </section>

      {/* Legal Compliance Section */}
      <section className="section-padding bg-white border-t border-dark-100">
        <div className="container-main max-w-4xl">
          <AnimatedSection className="text-center mb-10">
            <Scale className="w-10 h-10 text-primary-600 mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4">Legal Compliance & Patient Rights</h2>
            <p className="text-dark-500">Peptide South Africa operates in full compliance with South African healthcare regulations.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            <StaggerContainer staggerDelay={0.1}>
              <StaggerItem>
                <div className="card-hover p-5">
                  <FileText className="w-6 h-6 text-primary-600 mb-2" />
                  <h3 className="font-semibold text-dark-900 mb-1">Medicines Act Compliance</h3>
                  <p className="text-sm text-dark-500">All prescriptions issued by HPCSA-registered physicians. All medications compounded by SAPC-registered pharmacies. No unauthorized or falsified products.</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="card-hover p-5 mt-6">
                  <Shield className="w-6 h-6 text-primary-600 mb-2" />
                  <h3 className="font-semibold text-dark-900 mb-1">POPIA Data Protection</h3>
                  <p className="text-sm text-dark-500">AES-256 encryption at rest, TLS 1.3 in transit. Data stored in South Africa. Access restricted to authorized clinical staff. You have the right to access, correct, and delete your data.</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="card-hover p-5 mt-6">
                  <Stethoscope className="w-6 h-6 text-primary-600 mb-2" />
                  <h3 className="font-semibold text-dark-900 mb-1">HPCSA Telemedicine Guidelines</h3>
                  <p className="text-sm text-dark-500">All physicians follow HPCSA guidelines for telemedicine. Asynchronous assessments supplemented by synchronous review when clinically indicated. All prescribing decisions are documented and auditable.</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="card-hover p-5 mt-6">
                  <Globe className="w-6 h-6 text-primary-600 mb-2" />
                  <h3 className="font-semibold text-dark-900 mb-1">SAHPRA Monitoring</h3>
                  <p className="text-sm text-dark-500">We monitor all SAHPRA updates, warnings, and enforcement actions daily. We do not offer products that SAHPRA has warned against. We report adverse events to SAHPRA as required by law.</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
          <AnimatedSection className="mt-8 bg-red-50 rounded-xl p-5 border border-red-100">
            <h3 className="font-semibold text-red-800 mb-2">Medical Disclaimer</h3>
            <p className="text-sm text-red-700">
              Peptide South Africa provides telehealth services connecting patients with HPCSA-registered physicians and licensed compounding pharmacies. Peptide therapy is not appropriate for everyone. All protocols require physician evaluation and prescription. Results vary. Peptides are not approved for all indications by SAHPRA. Off-label prescribing is a clinical decision made by the treating physician based on individual patient assessment. This website and all associated content are for informational and educational purposes only. They do not constitute medical advice, diagnosis, or treatment. Never self-administer peptides without medical supervision. Never purchase peptides from unregulated sources. If you experience a medical emergency, call 10111 or 112 immediately.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <MessageCircle className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Our clinical team is here to help. Reach out via WhatsApp or email and we will get back to you within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
                Take Your 2-Minute Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="mailto:hello@peptide-south-africa.com" className="btn-ghost">
                <Phone className="w-4 h-4" />
                Email Clinical Team
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
