import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-gradient-primary">
      <div className="container-main section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            100% online visit + checkout, so you can keep living.
          </h2>
          <div className="mt-8">
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-primary-700 font-bold text-base hover:bg-dark-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl"
            >
              Let's do this
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
