import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ClosingStatement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding bg-dark-900">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Ride The Tide exists for people who are intentional about their health.
          </h2>
          <p className="mt-6 text-lg md:text-xl text-dark-400 leading-relaxed">
            We believe in the power of personalized medicine, guided by science and delivered with care.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
