import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { productImages } from "../../lib/assets";
import { Check } from "lucide-react";

const rideTheTideFeatures = [
  "Individual physician review before every prescription",
  "Ongoing care team access in your patient portal",
  "Compounded only at licensed SA pharmacies",
  "Created for you, guided by us. No guessing",
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
          <p className="text-sm font-semibold tracking-widest uppercase text-dark-400 mb-4">
            Real Doctors. Real Results. Made in South Africa.
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Personalized from the jump.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            loop
          >
            {/* Card 1: Peptide South Africa */}
            <SwiperSlide>
              <div className="card-dark p-6 md:p-8 max-w-3xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative rounded-2xl overflow-hidden bg-dark-800 aspect-square flex items-center justify-center">
                    <img
                      src={productImages.whooshBottle}
                      alt="Peptide South Africa bottle"
                      className="w-full h-full object-contain p-6"
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-dark-900/80 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                      <span className="text-white font-semibold text-sm">Peptide South Africa</span>
                    </div>
                  </div>
                  <div>
                    <ul className="space-y-4">
                      {rideTheTideFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary-400" strokeWidth={3} />
                          </div>
                          <span className="text-dark-300 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link
                        to="/about-us"
                        className="inline-flex items-center text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        Learn more about us
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* Card 2: Other Peptide Companies */}
            <SwiperSlide>
              <div className="card-dark p-6 md:p-8 max-w-3xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative rounded-2xl overflow-hidden bg-dark-800 aspect-square flex items-center justify-center">
                    <img
                      src={productImages.whooshBottle}
                      alt="Other peptide companies"
                      className="w-full h-full object-contain p-6 opacity-60 grayscale"
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-dark-900/80 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                      <span className="text-dark-400 font-semibold text-sm">Other Peptide Companies</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <p className="text-sm font-semibold tracking-widest uppercase text-dark-400 mb-2">
                      Did you know less than
                    </p>
                    <h3 className="text-6xl md:text-7xl font-bold gradient-text">9%</h3>
                    <p className="mt-2 text-dark-400 text-sm leading-relaxed">
                      of peptide companies source from accredited pharmacy partners?
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
