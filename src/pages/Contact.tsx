import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Twitter, Linkedin,
  ChevronRight, Handshake, Users
} from 'lucide-react';
import { backgroundImages, partnerImages } from '../lib/assets';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const quickLinks = [
    { question: 'How do I get started?', to: '/faqs' },
    { question: 'What does the consultation involve?', to: '/faqs' },
    { question: 'How much does it cost?', to: '/pricing' },
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={backgroundImages.newsletterBg} alt="Contact background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90" />
        </div>
        <div className="relative z-10 container-main py-16 md:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">Get in Touch</h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed">
              Have questions about peptide therapy? We are here to help you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl border border-dark-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold text-dark-900 mb-6">Send Us a Message</h2>
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-900 mb-2">Message Sent!</h3>
                    <p className="text-dark-500 text-sm">We will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium text-dark-700 mb-1.5 block">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        className="input-field"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-dark-700 mb-1.5 block">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="input-field"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-dark-700 mb-1.5 block">Phone</label>
                      <input
                        type="tel"
                        placeholder="+27 12 345 6789"
                        className="input-field"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-dark-700 mb-1.5 block">Subject</label>
                      <select
                        className="input-field"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      >
                        <option>General Inquiry</option>
                        <option>Product Question</option>
                        <option>Prescription Support</option>
                        <option>Billing & Subscription</option>
                        <option>Partnership</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-dark-700 mb-1.5 block">Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="How can we help you?"
                        className="input-field"
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn-primary mt-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* FAQ Shortcut */}
              <div className="mt-8 bg-white rounded-2xl border border-dark-100 shadow-sm p-6 md:p-8">
                <h3 className="text-lg font-bold text-dark-900 mb-4">Common Questions</h3>
                <div className="flex flex-col gap-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.question}
                      to={link.to}
                      className="flex items-center justify-between p-3 rounded-xl bg-dark-50 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
                    >
                      <span className="text-sm font-medium text-dark-700 group-hover:text-primary-700">{link.question}</span>
                      <ChevronRight className="w-4 h-4 text-dark-400 group-hover:text-primary-500" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-8"
            >
              <div className="bg-white rounded-2xl border border-dark-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold text-dark-900 mb-6">Contact Information</h2>
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-700">Email</p>
                      <a href="mailto:hello@app.peptide-south-africa.com" className="text-sm text-dark-500 hover:text-primary-600 transition-colors">hello@app.peptide-south-africa.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-700">Phone</p>
                      <a href="tel:+27123456789" className="text-sm text-dark-500 hover:text-primary-600 transition-colors">+27 12 345 6789</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-700">Address</p>
                      <p className="text-sm text-dark-500">Cape Town, South Africa</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-700">Business Hours</p>
                      <p className="text-sm text-dark-500">Mon – Fri, 9am – 5pm SAST</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-dark-100">
                  <p className="text-sm font-medium text-dark-700 mb-3">Follow Us</p>
                  <div className="flex items-center gap-3">
                    <a href="#" className="w-10 h-10 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl border border-dark-100 shadow-sm overflow-hidden">
                <div className="h-56 w-full rounded-2xl overflow-hidden">
                  <img
                    src={partnerImages.hillsideMorning}
                    alt="Cape Town, South Africa"
                    className="w-full h-full object-cover rounded-2xl"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="py-12 md:py-16 bg-white border-t border-dark-100">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100 p-6 md:p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                <Handshake className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Become a Partner</h3>
              <p className="text-dark-500 text-sm leading-relaxed mb-4">
                Are you a healthcare professional, wellness clinic, or fitness center? Partner with Peptide South Africa to offer physician-guided peptide therapy to your clients. We provide training, marketing support, and competitive commissions.
              </p>
              <a href="mailto:partners@app.peptide-south-africa.com" className="btn-secondary inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Partnerships
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl border border-accent-100 p-6 md:p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Affiliate Program</h3>
              <p className="text-dark-500 text-sm leading-relaxed mb-4">
                Join our affiliate program and earn commissions by sharing Peptide South Africa with your audience. Whether you are a content creator, influencer, or health coach, we offer generous payouts and dedicated support.
              </p>
              <a href="mailto:affiliates@app.peptide-south-africa.com" className="btn-secondary inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Apply as Affiliate
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
