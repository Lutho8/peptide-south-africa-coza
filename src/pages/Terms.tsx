import LegalSidebar from '../components/support/LegalSidebar';

const tocItems = [
  { id: 'agreement', label: 'Agreement to Terms' },
  { id: 'medical-disclaimer', label: 'Medical Disclaimer' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'account', label: 'Account Registration' },
  { id: 'products', label: 'Products and Services' },
  { id: 'prescription', label: 'Prescription Requirements' },
  { id: 'payment', label: 'Payment and Billing' },
  { id: 'shipping', label: 'Shipping and Delivery' },
  { id: 'returns', label: 'Returns and Refunds' },
  { id: 'intellectual', label: 'Intellectual Property' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'governing', label: 'Governing Law' },
  { id: 'dispute', label: 'Dispute Resolution' },
  { id: 'changes', label: 'Changes to Terms' },
  { id: 'contact', label: 'Contact Information' },
];

export default function Terms() {
  const today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <LegalSidebar title="Terms & Conditions" lastUpdated={today} items={tocItems}>
      <section id="agreement" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">1. Agreement to Terms</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          These Terms and Conditions ("Terms") govern your access to and use of the Ride The Tide website, mobile applications, and peptide therapy services (collectively, the "Services"). By creating an account, placing an order, or otherwise using our Services, you agree to be bound by these Terms.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          If you do not agree to these Terms, you must not use our Services. We reserve the right to modify these Terms at any time. Your continued use of the Services after changes constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section id="medical-disclaimer" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">2. Medical Disclaimer</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          The information provided on our website and through our Services is for educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          Peptide therapy involves prescription medications that require physician oversight. Individual results may vary. Never disregard professional medical advice or delay seeking it because of something you have read on our website.
        </p>
      </section>

      <section id="eligibility" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">3. Eligibility</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          To use our Services, you must be at least 18 years of age and a resident of South Africa. By using our Services, you represent and warrant that you meet these eligibility requirements and that all information you provide is accurate, complete, and current.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion, including if we believe you do not meet eligibility requirements or have violated these Terms.
        </p>
      </section>

      <section id="account" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">4. Account Registration</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          To access certain features of our Services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to protect your account information.
        </p>
      </section>

      <section id="products" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">5. Products and Services</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          Ride The Tide provides physician-supervised peptide therapy protocols, compounded medications, and related wellness products. All products are sourced from licensed compounding pharmacies that meet South African regulatory standards.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          Product descriptions, images, and pricing are subject to change without notice. We make reasonable efforts to ensure accuracy but do not guarantee that all product information is error-free.
        </p>
      </section>

      <section id="prescription" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">6. Prescription Requirements</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          Certain products offered through our Services require a valid prescription from a licensed South African physician. Our platform facilitates consultations with qualified doctors who will evaluate your eligibility and issue prescriptions where appropriate.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          You may not transfer, sell, or share your prescription or medication with any other person. All prescriptions are issued for your personal use only and are non-transferable.
        </p>
      </section>

      <section id="payment" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">7. Payment and Billing</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          All prices are listed in South African Rand (ZAR) and include applicable taxes unless otherwise stated. Payment is required at the time of order placement. We accept major credit cards, debit cards, and selected electronic payment methods.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          Subscription services will be billed automatically at the beginning of each billing cycle. You may cancel or modify your subscription at any time through your account portal or by contacting our support team.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          Failed payments may result in suspension of your subscription or account. We reserve the right to change pricing at any time, with notice provided to existing subscribers before the change takes effect.
        </p>
      </section>

      <section id="shipping" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">8. Shipping and Delivery</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We deliver to addresses within South Africa. Shipping times vary by location and courier availability. Estimated delivery times are provided at checkout but are not guaranteed. We are not responsible for delays caused by courier services, customs, or events beyond our control.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          You are responsible for providing an accurate and complete delivery address. We are not liable for orders shipped to incorrect addresses provided by you. Cold-chain products require special handling; please ensure someone is available to receive refrigerated packages.
        </p>
      </section>

      <section id="returns" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">9. Returns and Refunds</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We offer a 30-day satisfaction guarantee on eligible products. Due to the nature of prescription medications, opened, used, or temperature-compromised products cannot be returned unless defective.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          For full details, please refer to our <a href="#/return-policy" className="text-primary-600 hover:underline">Return Policy</a>. Refunds, where approved, will be processed to the original payment method within 7–14 business days.
        </p>
      </section>

      <section id="intellectual" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">10. Intellectual Property</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          All content on our website, including text, graphics, logos, images, videos, and software, is the property of Ride The Tide or its licensors and is protected by South African and international copyright, trademark, and other intellectual property laws.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any of our content without our prior written consent.
        </p>
      </section>

      <section id="liability" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">11. Limitation of Liability</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          To the maximum extent permitted by law, Ride The Tide and its directors, employees, partners, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our Services.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          Our total liability for any claim arising from these Terms or your use of the Services shall not exceed the amount you paid to us in the 12 months preceding the event giving rise to the liability.
        </p>
      </section>

      <section id="governing" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">12. Governing Law</h2>
        <p className="text-dark-500 text-sm leading-relaxed">
          These Terms are governed by and construed in accordance with the laws of the Republic of South Africa. You agree to submit to the exclusive jurisdiction of the courts of South Africa for any disputes arising from these Terms or your use of our Services.
        </p>
      </section>

      <section id="dispute" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">13. Dispute Resolution</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          In the event of a dispute, we encourage you to contact us first to seek an informal resolution. If the dispute cannot be resolved within 30 days, either party may pursue formal resolution through mediation or arbitration in Cape Town, South Africa, in accordance with the rules of the Arbitration Foundation of Southern Africa.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          Nothing in this section prevents either party from seeking urgent interdictory or declaratory relief from a court of competent jurisdiction.
        </p>
      </section>

      <section id="changes" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">14. Changes to Terms</h2>
        <p className="text-dark-500 text-sm leading-relaxed">
          We may update these Terms from time to time. The most current version will always be posted on our website with the "Last updated" date. Material changes will be notified to you via email or through your account. Your continued use of the Services after changes constitutes acceptance.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-xl font-bold text-dark-900 mb-3">15. Contact Information</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          If you have any questions about these Terms, please contact us:
        </p>
        <div className="text-dark-500 text-sm leading-relaxed">
          <p><strong>Email:</strong> <a href="mailto:legal@ridethetide.info" className="text-primary-600 hover:underline">legal@ridethetide.info</a></p>
          <p><strong>Address:</strong> Cape Town, South Africa</p>
          <p><strong>Phone:</strong> +27 12 345 6789</p>
        </div>
      </section>
    </LegalSidebar>
  );
}
