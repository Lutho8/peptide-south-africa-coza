import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function NewsletterCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for newsletter submission
    alert("Thanks for subscribing! (Placeholder)");
    setEmail("");
  };

  return (
    <section ref={ref} className="section-padding bg-dark-100">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 tracking-tight">
            Unlock the free guide to protein for weight loss.
          </h2>
          <p className="mt-4 text-lg text-dark-500 leading-relaxed">
            Written by our physicians. Delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Get The Guide
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
