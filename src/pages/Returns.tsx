import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Package, RefreshCcw, Clock, AlertTriangle, Mail, MessageCircle } from 'lucide-react';

export default function Returns() {

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
              <RefreshCcw className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">Return Policy</h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed">
              Hassle-free returns backed by our 30-day satisfaction guarantee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Guarantee Highlight */}
      <section className="py-12 md:py-16 bg-white border-b border-dark-100">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100 p-6 md:p-8 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark-900 mb-2">30-Day Satisfaction Guarantee</h2>
            <p className="text-dark-500 text-sm leading-relaxed">
              We stand behind our products. If you are not completely satisfied with your purchase, contact us within 30 days of delivery for a refund or replacement. Your wellbeing is our priority.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-dark-50">
        <div className="container-main max-w-4xl">
          <div className="bg-white rounded-2xl border border-dark-100 shadow-sm p-6 md:p-8 lg:p-10">
            {/* Eligibility */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-dark-900">Eligibility for Returns</h2>
              </div>
              <p className="text-dark-500 text-sm leading-relaxed mb-3">
                You may request a return if:
              </p>
              <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2">
                <li>The product is unopened, unused, and in its original packaging</li>
                <li>You submit the return request within 30 days of delivery</li>
                <li>You provide proof of purchase (order number or receipt)</li>
                <li>The product was not purchased as part of a non-refundable promotional bundle</li>
              </ul>
              <p className="text-dark-500 text-sm leading-relaxed mt-3">
                Due to the nature of prescription medications and temperature-sensitive compounds, opened, used, partially consumed, or improperly stored products are not eligible for return unless they are defective or damaged upon arrival.
              </p>
            </div>

            {/* How to Initiate */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <RefreshCcw className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-dark-900">How to Initiate a Return</h2>
              </div>
              <ol className="list-decimal list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-3">
                <li>
                  <strong>Contact us</strong> via email at <a href="mailto:returns@app.peptide-south-africa.com" className="text-primary-600 hover:underline">returns@app.peptide-south-africa.com</a> or through your patient portal with your order number and reason for return.
                </li>
                <li>
                  <strong>Receive authorization</strong> — our support team will review your request and issue a Return Merchandise Authorization (RMA) number if eligible.
                </li>
                <li>
                  <strong>Package safely</strong> — return the product in its original packaging, including any accessories, instructions, and cold packs if applicable.
                </li>
                <li>
                  <strong>Ship to us</strong> — we will provide a prepaid return label for qualifying returns within South Africa. For international returns, shipping costs may be your responsibility.
                </li>
              </ol>
            </div>

            {/* Refund Timeline */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-dark-900">Refund Process and Timeline</h2>
              </div>
              <p className="text-dark-500 text-sm leading-relaxed mb-3">
                Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. Approved refunds are processed within 7–14 business days to the original payment method.
              </p>
              <p className="text-dark-500 text-sm leading-relaxed">
                Depending on your bank or payment provider, it may take an additional 3–5 business days for the credit to appear in your account. Subscription refunds are prorated based on unused portions of the billing cycle.
              </p>
            </div>

            {/* Exclusions */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-dark-900">Exclusions</h2>
              </div>
              <p className="text-dark-500 text-sm leading-relaxed mb-3">
                The following items are not eligible for return:
              </p>
              <ul className="list-disc list-inside text-dark-500 text-sm leading-relaxed flex flex-col gap-2">
                <li>Opened, used, or partially consumed medications or peptides</li>
                <li>Products that have been left unrefrigerated or improperly stored</li>
                <li>Items damaged due to customer misuse or negligence</li>
                <li>Gift cards and promotional vouchers</li>
                <li>Products purchased more than 30 days ago</li>
                <li>Custom-compounded prescriptions not due to pharmacy error</li>
              </ul>
            </div>

            {/* Damaged/Defective */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-dark-900">Damaged or Defective Items</h2>
              </div>
              <p className="text-dark-500 text-sm leading-relaxed">
                If your order arrives damaged, defective, or incorrect, please contact us within 48 hours of delivery with photos of the packaging and product. We will arrange a free replacement or full refund at no cost to you. Do not discard the original packaging until the issue is resolved.
              </p>
            </div>

            {/* Contact */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-dark-900">Contact for Returns</h2>
              </div>
              <p className="text-dark-500 text-sm leading-relaxed mb-4">
                Our support team is ready to assist with your return. Reach out to us and we will guide you through the process step by step.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:returns@app.peptide-south-africa.com" className="btn-primary inline-flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Returns Team
                </a>
                <Link to="/contact-us" className="btn-secondary inline-flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
