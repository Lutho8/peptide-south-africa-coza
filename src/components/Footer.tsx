import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const footerLinks = {
  products: [
    { label: 'Tirzepatide', href: '/products/compounded-tirzepatide' },
    { label: 'Semaglutide', href: '/products/compounded-semaglutide' },
    { label: 'NAD+', href: '/products/nad' },
    { label: 'Sermorelin', href: '/products/sermorelin' },
    { label: 'Glutathione', href: '/products/glutathione' },
  ],
  resources: [
    { label: 'Blog', href: '/blogs' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Pricing', href: '/pricing' },
  ],
  company: [
    { label: 'About', href: '/about-us' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pharmacy Standards', href: '/pharmacy-standards' },
    { label: 'Peptide Therapy', href: '/peptide-therapy' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Return Policy', href: '/return-policy' },
    { label: 'HIPAA Privacy Policy', href: '/hippa-privacy-policy' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-dark-300">
      {/* Newsletter Section */}
      <div className="border-b border-dark-800">
        <div className="container-main py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Unlock the free guide to protein for weight loss
            </h3>
            <p className="text-dark-400 mb-6 text-sm">
              Written by our physicians. Delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-1 bg-dark-800 border-dark-700 text-white placeholder:text-dark-500 focus:ring-primary-500/50 focus:border-primary-500"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Get The Guide
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">RT</span>
              </div>
              <span className="font-bold text-white text-lg">Ride The Tide</span>
            </Link>
            <p className="text-sm text-dark-400 mb-4">
              Personalized peptide protocols for weight loss, longevity & recovery. Physician-supervised, compounded at licensed SA pharmacies.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-dark-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Products</h4>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-dark-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-dark-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-dark-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Stay Updated</h4>
            <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm placeholder:text-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button type="submit" className="px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors">
                Subscribe
              </button>
            </form>
            <div className="space-y-2.5">
              <a href="mailto:hello@ridethetide.info" className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                hello@ridethetide.info
              </a>
              <a href="tel:+27123456789" className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                +27 12 345 6789
              </a>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <MapPin className="w-4 h-4" />
                Cape Town, South Africa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-800">
        <div className="container-main py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-dark-500">
              © {new Date().getFullYear()} Ride The Tide. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link key={link.href} to={link.href} className="text-xs text-dark-500 hover:text-dark-300 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
