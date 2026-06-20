import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { instagramImages } from "../../lib/assets";

const posts = [
  instagramImages.post1,
  instagramImages.post2,
  instagramImages.post1,
  instagramImages.post2,
  instagramImages.post1,
  instagramImages.post2,
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
          {posts.map((src, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={src}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
