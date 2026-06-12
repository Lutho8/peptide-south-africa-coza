import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const gradients = [
  "from-primary-400 to-primary-700",
  "from-accent-400 to-accent-700",
  "from-emerald-400 to-emerald-700",
  "from-purple-400 to-purple-700",
  "from-cyan-400 to-cyan-700",
  "from-amber-400 to-amber-700",
];

export default function InstagramFeed() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-900 tracking-tight uppercase">
            Stay ahead of the curve @ridethetide
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {gradients.map((grad, i) => (
            <div
              key={i}
              className={`aspect-square bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center hover:scale-[1.02] transition-transform duration-300`}
            >
              <span className="text-white/60 text-xs font-medium">Instagram</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
