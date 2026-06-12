import LegalSidebar from '../components/support/LegalSidebar';

const tocItems = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Information' },
  { id: 'sharing', label: 'Sharing Your Information' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'data-security', label: 'Data Security' },
  { id: 'cookies', label: 'Cookies and Tracking' },
  { id: 'third-party', label: 'Third-Party Services' },
  { id: 'children', label: "Children's Privacy" },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact Us' },
];

export default function Privacy() {
  const today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <LegalSidebar title="Privacy Policy" lastUpdated={today} items={tocItems}>
      <section id="introduction" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">1. Introduction</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          Ride The Tide ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our website, services, and peptide therapy platform.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          By accessing or using our services, you consent to the practices described in this policy. If you do not agree, please do not use our platform. This policy is designed to comply with the Protection of Personal Information Act 4 of 2013 (POPIA) of South Africa.
        </p>
      </section>

      <section id="information-we-collect" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">2. Information We Collect</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We collect information you provide directly to us, including your name, email address, phone number, physical address, date of birth, medical history, and payment details. This information is necessary to provide our peptide therapy services safely and legally.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We also automatically collect certain information when you visit our website, such as your IP address, browser type, device information, pages visited, and timestamps. This helps us improve our platform and detect security issues.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          In some cases, we may receive information from third parties, such as payment processors, identity verification services, or healthcare providers involved in your care.
        </p>
      </section>

      <section id="how-we-use" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">3. How We Use Your Information</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We use your personal information to:
        </p>
        <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2 mb-3">
          <li>Provide, operate, and maintain our peptide therapy services</li>
          <li>Process prescriptions, payments, and deliveries</li>
          <li>Facilitate consultations with licensed physicians</li>
          <li>Communicate with you about your account, orders, and health updates</li>
          <li>Send marketing communications (with your consent, which you may withdraw at any time)</li>
          <li>Comply with legal and regulatory obligations, including SAHPRA and HPCSA requirements</li>
          <li>Improve our website, products, and services through analytics</li>
          <li>Detect, prevent, and address fraud, security, or technical issues</li>
        </ul>
      </section>

      <section id="sharing" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">4. Sharing Your Information</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We do not sell your personal information. We may share it with:
        </p>
        <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2 mb-3">
          <li><strong>Healthcare providers</strong> involved in your treatment, including prescribing physicians and compounding pharmacies</li>
          <li><strong>Service providers</strong> who perform functions on our behalf, such as payment processing, delivery logistics, and IT support</li>
          <li><strong>Regulatory authorities</strong> when required by law or to protect our legal rights</li>
          <li><strong>Professional advisers</strong> such as auditors, lawyers, and insurers</li>
        </ul>
        <p className="text-dark-500 text-sm leading-relaxed">
          All third parties who receive your data are contractually bound to protect it and use it only for the purposes we specify.
        </p>
      </section>

      <section id="your-rights" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">5. Your Rights (POPIA)</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          Under South Africa's Protection of Personal Information Act (POPIA), you have the following rights:
        </p>
        <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2 mb-3">
          <li><strong>Right to access</strong> — request a copy of the personal information we hold about you</li>
          <li><strong>Right to correction</strong> — request that we update or correct inaccurate information</li>
          <li><strong>Right to deletion</strong> — request deletion of your personal information, subject to legal retention requirements</li>
          <li><strong>Right to object</strong> — object to processing for direct marketing or other legitimate purposes</li>
          <li><strong>Right to portability</strong> — request your data in a structured, machine-readable format</li>
          <li><strong>Right to withdraw consent</strong> — withdraw consent for processing where consent is the legal basis</li>
        </ul>
        <p className="text-dark-500 text-sm leading-relaxed">
          To exercise any of these rights, contact us at <a href="mailto:privacy@ridethetide.info" className="text-primary-600 hover:underline">privacy@ridethetide.info</a>. We will respond within 30 days.
        </p>
      </section>

      <section id="data-security" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">6. Data Security</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, secure servers, and regular security audits.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          Despite our efforts, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to continuously improving our protections.
        </p>
      </section>

      <section id="cookies" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">7. Cookies and Tracking</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. Cookies are small text files stored on your device that help us recognize you and remember your preferences.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          You can manage or disable cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          We may use third-party analytics services (such as Google Analytics) that set their own cookies. These services help us understand how visitors interact with our site.
        </p>
      </section>

      <section id="third-party" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">8. Third-Party Services</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          Our website may contain links to third-party websites or services that are not operated by us. This Privacy Policy does not apply to those third parties. We encourage you to review the privacy policies of any external sites you visit.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          We are not responsible for the content, privacy practices, or security of third-party websites.
        </p>
      </section>

      <section id="children" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">9. Children's Privacy</h2>
        <p className="text-dark-500 text-sm leading-relaxed">
          Our services are intended for adults aged 18 and older. We do not knowingly collect personal information from children under 18. If we become aware that we have collected data from a minor, we will take steps to delete it promptly. If you believe a child has provided us with personal information, please contact us immediately.
        </p>
      </section>

      <section id="changes" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">10. Changes to This Policy</h2>
        <p className="text-dark-500 text-sm leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of significant changes by posting the updated policy on our website with a revised "Last updated" date. We encourage you to review this policy periodically.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-xl font-bold text-dark-900 mb-3">11. Contact Us</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
        </p>
        <div className="text-dark-500 text-sm leading-relaxed">
          <p><strong>Email:</strong> <a href="mailto:privacy@ridethetide.info" className="text-primary-600 hover:underline">privacy@ridethetide.info</a></p>
          <p><strong>Address:</strong> Cape Town, South Africa</p>
          <p><strong>Phone:</strong> +27 12 345 6789</p>
        </div>
      </section>
    </LegalSidebar>
  );
}
