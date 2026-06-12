import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 to-dark-800 min-h-[700px] md:min-h-[800px] flex items-center">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Daily performance starts with the right protocol.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-dark-300 max-w-lg leading-relaxed">
              Physician-supervised peptide protocols for weight loss, longevity & recovery. Compounded at licensed SA pharmacies.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/how-it-works" className="btn-primary">
                Start Today
              </Link>
              <Link to="/peptide-therapy" className="btn-ghost">
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-[320px] h-[420px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[600px] rounded-3xl bg-gradient-to-br from-primary-400 via-accent-500 to-primary-700 shadow-2xl shadow-primary-500/20 flex items-center justify-center"
              >
                <span className="text-white/60 text-lg font-medium">Product Image</span>
              </motion.div>
              {/* Floating accent card */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 md:-left-10 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-dark-900">SAHPRA Compliant</p>
                  <p className="text-xs text-dark-500">Licensed Pharmacies</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
