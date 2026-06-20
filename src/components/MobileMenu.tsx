import { Link } from 'react-router-dom'
import { X, ChevronRight, ShoppingCart, User } from 'lucide-react'
import { useEffect } from 'react'

const mobileNavLinks = [
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'Weight Loss', href: '/programs/weight-loss' },
      { label: 'Longevity', href: '/programs/longevity' },
      { label: 'Metabolic Reset', href: '/programs/metabolic-reset' },
      { label: 'Muscle Recovery', href: '/programs/muscle-recovery' },
      { label: 'Sports Performance', href: '/programs/sports-performance' },
    ],
  },
  { label: 'Peptide Database', href: '/peptide-database' },
  { label: 'Blog', href: '/blogs' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about-us' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Peptide Therapy', href: '/peptide-therapy' },
  { label: 'Pharmacy Standards', href: '/pharmacy-standards' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact-us' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-dark-100">
          <span className="font-bold text-lg text-dark-900">Menu</span>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-dark-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-dark-700" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-1">
          {mobileNavLinks.map((link) => (
            <div key={link.label}>
              <Link
                to={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 text-base font-medium text-dark-800 hover:text-primary-600 transition-colors"
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-dark-400" />
              </Link>
              {link.children && (
                <div className="pl-4 border-l-2 border-primary-100 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={onClose}
                      className="block py-2 text-sm text-dark-500 hover:text-primary-600 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-dark-100 space-y-3">
          <Link
            to="#"
            className="flex items-center gap-2 py-2 text-sm font-medium text-dark-700 hover:text-primary-600 transition-colors"
          >
            <User className="w-4 h-4" />
            Log In
          </Link>
          <Link
            to="#"
            className="flex items-center gap-2 py-2 text-sm font-medium text-dark-700 hover:text-primary-600 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
          </Link>
          <Link to="/assessment" onClick={onClose} className="btn-primary w-full justify-center">
            Take Assessment
          </Link>
        </div>
      </div>
    </div>
  )
}
