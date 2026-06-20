import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { videoUrls } from "../../lib/assets";
import { Check } from "lucide-react";

const features = [
  "Physician-supervised Care",
  "Direct from Licensed SA Pharmacies",
  "100% Online Visit + Checkout",
  "No Insurance Required",
];

export default function DesignedForYouSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding bg-white overflow-hidden">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-square"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={videoUrls.funnel.mp4} type="video/mp4" />
              <source src={videoUrls.funnel.webm} type="video/webm" />
            </video>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 tracking-tight">
              Designed for you.
            </h2>
            <p className="mt-4 text-lg text-dark-500 leading-relaxed">
              The Peptide South Africa journey starts with a tailored protocol, around your goals, with a clinician who personally reviews your intake.
            </p>

            <ul className="mt-8 space-y-4">
              {features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-dark-700 font-medium text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                to="/products"
                className="btn-primary"
              >
                Find Your Protocol
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
