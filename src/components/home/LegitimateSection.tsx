import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const stats = [
  { value: "100%", label: "Physician-Supervised" },
  { value: "3rd Party", label: "Tested & Verified" },
  { value: "Licensed", label: "SA Pharmacies" },
];

export default function LegitimateSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding bg-dark-900">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight uppercase">
            Real Doctors. Real Results. Made in South Africa.
          </h2>
          <p className="mt-4 text-lg text-dark-400 leading-relaxed">
            Personalized from start to finish.
          </p>
        </motion.div>

        {/* Desktop stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="card-dark p-8 text-center">
              <p className="text-4xl lg:text-5xl font-bold gradient-text">{stat.value}</p>
              <p className="mt-2 text-dark-400 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mobile Swiper */}
        <div className="md:hidden">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides
            loop
          >
            {stats.map((stat) => (
              <SwiperSlide key={stat.label}>
                <div className="card-dark p-8 text-center mx-2">
                  <p className="text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="mt-2 text-dark-400 text-sm font-medium">{stat.label}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
