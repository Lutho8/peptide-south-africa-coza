import LegalSidebar from '../components/support/LegalSidebar';

const tocItems = [
  { id: 'notice', label: 'Notice of Privacy Practices' },
  { id: 'rights', label: 'Your Health Information Rights' },
  { id: 'responsibilities', label: 'Our Responsibilities' },
  { id: 'use-share', label: 'How We Use and Share Information' },
  { id: 'security', label: 'Data Security Measures' },
  { id: 'breach', label: 'Breach Notification' },
  { id: 'complaints', label: 'Complaints' },
  { id: 'contact', label: 'Contact Information' },
];

export default function Hipaa() {
  const today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <LegalSidebar title="HIPAA Privacy Policy" lastUpdated={today} items={tocItems}>
      <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Note for South African patients:</strong> While "HIPAA" is a United States regulation, Ride The Tide applies equivalent privacy and security standards to your health information in compliance with South Africa's <strong>Protection of Personal Information Act (POPIA)</strong> and <strong>Health Professions Council of South Africa (HPCSA)</strong> ethical guidelines. This policy describes our commitment to protecting your health data with the same rigor as HIPAA-compliant U.S. providers.
        </p>
      </div>

      <section id="notice" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">1. Notice of Privacy Practices</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          This Notice of Privacy Practices describes how Ride The Tide collects, uses, discloses, and safeguards your personal health information (PHI). We are required by law to maintain the privacy of your health information and to provide you with this notice of our legal duties and privacy practices.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          We reserve the right to change our privacy practices and the terms of this notice. Any changes will apply to all health information we maintain, including information created or received before the change date. We will post the updated notice on our website and notify you of material changes.
        </p>
      </section>

      <section id="rights" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">2. Your Health Information Rights</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          Under POPIA and HPCSA guidelines, you have the following rights regarding your health information:
        </p>
        <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2 mb-3">
          <li><strong>Right to access</strong> — request and receive a copy of your medical records and health information</li>
          <li><strong>Right to correction</strong> — request that we amend inaccurate or incomplete health information</li>
          <li><strong>Right to confidentiality</strong> — your health information will not be disclosed without your consent, except as required by law</li>
          <li><strong>Right to restrict use</strong> — request limits on how we use or share your information in certain circumstances</li>
          <li><strong>Right to accounting of disclosures</strong> — request a list of certain disclosures we have made of your health information</li>
          <li><strong>Right to complain</strong> — lodge a complaint with us or the Information Regulator of South Africa if you believe your privacy rights have been violated</li>
        </ul>
        <p className="text-dark-500 text-sm leading-relaxed">
          To exercise any of these rights, contact our Privacy Officer at <a href="mailto:privacy@ridethetide.info" className="text-primary-600 hover:underline">privacy@ridethetide.info</a>.
        </p>
      </section>

      <section id="responsibilities" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">3. Our Responsibilities</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          Ride The Tide is committed to:
        </p>
        <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2">
          <li>Maintaining the privacy and security of your health information at all times</li>
          <li>Informing you of our privacy practices and any changes to them</li>
          <li>Honoring your rights as described above, subject to legal and ethical constraints</li>
          <li>Training all staff and contractors on privacy obligations and data handling</li>
          <li>Conducting regular audits and risk assessments of our information systems</li>
          <li>Complying with SAHPRA, HPCSA, and POPIA requirements for health data</li>
        </ul>
      </section>

      <section id="use-share" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">4. How We Use and Share Information</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We use and disclose your health information for the following purposes:
        </p>
        <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2 mb-3">
          <li><strong>Treatment</strong> — to provide, coordinate, or manage your peptide therapy and related healthcare services</li>
          <li><strong>Payment</strong> — to process payments, verify insurance, and manage billing</li>
          <li><strong>Healthcare operations</strong> — to improve quality, train staff, conduct audits, and comply with regulations</li>
          <li><strong>Public health</strong> — as required by law for disease reporting, product recalls, or FDA/SAHPRA compliance</li>
          <li><strong>Research</strong> — only in de-identified form or with your explicit consent</li>
          <li><strong>Legal compliance</strong> — when required by court order, subpoena, or other legal process</li>
        </ul>
        <p className="text-dark-500 text-sm leading-relaxed">
          We will not sell your health information or use it for marketing purposes without your explicit written consent.
        </p>
      </section>

      <section id="security" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">5. Data Security Measures</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          We implement comprehensive technical, administrative, and physical safeguards to protect your health information, including:
        </p>
        <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2 mb-3">
          <li>End-to-end encryption for data in transit and at rest</li>
          <li>Role-based access controls and multi-factor authentication</li>
          <li>Secure, ISO-certified cloud infrastructure with regular penetration testing</li>
          <li>Strict confidentiality agreements with all staff and third-party vendors</li>
          <li>Physical security controls for any paper records or devices</li>
          <li>Regular backups and disaster recovery protocols</li>
        </ul>
        <p className="text-dark-500 text-sm leading-relaxed">
          Our security practices are regularly reviewed and aligned with international standards including ISO 27001 and NIST guidelines.
        </p>
      </section>

      <section id="breach" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">6. Breach Notification</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          In the unlikely event of a data breach involving your health information, we will notify you promptly and in accordance with POPIA requirements. Notification will include:
        </p>
        <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2 mb-3">
          <li>A description of the breach and the information involved</li>
          <li>The steps we have taken to contain and mitigate the breach</li>
          <li>Recommendations for steps you can take to protect yourself</li>
          <li>Contact information for our Privacy Officer and the Information Regulator</li>
        </ul>
        <p className="text-dark-500 text-sm leading-relaxed">
          We will also notify the Information Regulator of South Africa and any affected third parties as required by law.
        </p>
      </section>

      <section id="complaints" className="mb-10">
        <h2 className="text-xl font-bold text-dark-900 mb-3">7. Complaints</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          If you believe your privacy rights have been violated, you have the right to file a complaint with us or with the Information Regulator of South Africa. We will not retaliate against you for filing a complaint.
        </p>
        <p className="text-dark-500 text-sm leading-relaxed">
          To file a complaint with us, contact our Privacy Officer at <a href="mailto:privacy@ridethetide.info" className="text-primary-600 hover:underline">privacy@ridethetide.info</a>. To file a complaint with the Information Regulator, visit <a href="https://www.inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">www.inforegulator.org.za</a>.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-xl font-bold text-dark-900 mb-3">8. Contact Information</h2>
        <p className="text-dark-500 text-sm leading-relaxed mb-3">
          For questions about this privacy notice, to exercise your rights, or to report concerns, please contact:
        </p>
        <div className="text-dark-500 text-sm leading-relaxed">
          <p><strong>Privacy Officer</strong></p>
          <p>Ride The Tide</p>
          <p>Cape Town, South Africa</p>
          <p><strong>Email:</strong> <a href="mailto:privacy@ridethetide.info" className="text-primary-600 hover:underline">privacy@ridethetide.info</a></p>
          <p><strong>Phone:</strong> +27 12 345 6789</p>
        </div>
      </section>
    </LegalSidebar>
  );
}
