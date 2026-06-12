import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">404</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-dark-900 mb-3">Page Not Found</h1>
        <p className="text-dark-500 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link to="/contact-us" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
