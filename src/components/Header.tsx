import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, ChevronDown, ShoppingCart, User } from 'lucide-react'
import MobileMenu from './MobileMenu'

const navLinks = [
  {
    label: 'Programs',
    href: '/programs',
    dropdown: [
      { label: 'Weight Loss', href: '/programs/weight-loss' },
      { label: 'Longevity', href: '/programs/longevity' },
      { label: 'Metabolic Reset', href: '/programs/metabolic-reset' },
      { label: 'Muscle Recovery', href: '/programs/muscle-recovery' },
      { label: 'Sports Performance', href: '/programs/sports-performance' },
    ],
  },
  {
    label: 'Peptide Database',
    href: '/peptide-database',
  },
  {
    label: 'Blog',
    href: '/blogs',
  },
  {
    label: 'FAQ',
    href: '/faq',
  },
  { label: 'About', href: '/about-us' },
  {
    label: 'Explore',
    href: '#',
    dropdown: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Peptide Therapy', href: '/peptide-therapy' },
      { label: 'Pharmacy Standards', href: '/pharmacy-standards' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [location])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-dark-100/50'
            : 'bg-white/60 backdrop-blur-md'
        }`}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">PSA</span>
              </div>
              <span className="font-bold text-dark-900 text-lg hidden sm:block group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-accent-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                Peptide South Africa
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.dropdown ? (
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark-700 hover:text-primary-600 rounded-lg hover:bg-primary-50/50 transition-colors">
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="px-3 py-2 text-sm font-medium text-dark-700 hover:text-primary-600 rounded-lg hover:bg-primary-50/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.dropdown && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-dark-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block px-4 py-2.5 text-sm text-dark-700 hover:text-primary-600 hover:bg-primary-50/50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="#"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-dark-100 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-dark-700" />
              </Link>
              <Link
                to="#"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-dark-700 hover:text-primary-600 rounded-lg hover:bg-primary-50/50 transition-colors"
              >
                <User className="w-4 h-4" />
                Log In
              </Link>
              <Link to="/assessment" className="btn-primary text-sm px-4 py-2">
                Take Assessment
              </Link>
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-dark-100 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-dark-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
