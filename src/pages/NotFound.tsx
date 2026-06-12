import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, HelpCircle, MessageCircle, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  const suggestedLinks = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Blog', to: '/blogs', icon: BookOpen },
    { label: 'FAQs', to: '/faqs', icon: HelpCircle },
    { label: 'Contact', to: '/contact-us', icon: MessageCircle },
  ];

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-50 to-white">
      <div className="container-main py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 404 Illustration */}
            <div className="relative mx-auto mb-8 w-40 h-40 md:w-48 md:h-48">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-400 via-accent-400 to-primary-600 opacity-20 blur-2xl" />
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/25">
                <span className="text-white font-bold text-5xl md:text-6xl tracking-tight">404</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-dark-900 mb-3">Page Not Found</h1>
            <p className="text-dark-500 mb-8 max-w-md mx-auto leading-relaxed">
              The page you are looking for does not exist or has been moved. Try searching below or explore one of our popular pages.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search our site..."
                  className="input-field pl-10 pr-4 py-3 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      window.location.href = `/blogs`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Suggested Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-lg mx-auto">
              {suggestedLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-dark-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary-200 transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-dark-700">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
