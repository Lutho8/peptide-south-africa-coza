import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { howItWorksImages } from "../../lib/assets";

const steps = [
  {
    number: "01",
    title: "A SIMPLE QUESTIONNAIRE",
    description: "Tell us about your goals, lifestyle, and health history.",
    image: howItWorksImages.questionnaire,
    alt: "Simple questionnaire",
  },
  {
    number: "02",
    title: "PHYSICIAN REVIEW",
    description: "A licensed physician reviews your profile and creates a personalized protocol.",
    image: howItWorksImages.physicianReview,
    alt: "Physician review",
  },
  {
    number: "03",
    title: "PROTOCOL DELIVERED",
    description: "Your compounded peptides arrive at your door, ready to start.",
    image: howItWorksImages.protocolDelivered,
    alt: "Protocol delivered",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight">
            3-Step process
          </h2>
          <p className="mt-4 text-lg text-dark-500 leading-relaxed">
            Here's how it works:
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="card-hover overflow-hidden"
            >
              <div className="w-full h-[220px] flex items-center justify-center overflow-hidden">
                <img
                  src={step.image}
                  alt={step.alt}
                  className="w-full h-full object-cover rounded-t-2xl"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-dark-900 uppercase tracking-wide">{step.title}</h3>
                <p className="mt-2 text-sm text-dark-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swiper */}
        <div className="md:hidden">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1.1}
          >
            {steps.map((step) => (
              <SwiperSlide key={step.number}>
                <div className="card-hover overflow-hidden mx-1">
                  <div className="w-full h-[220px] flex items-center justify-center overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-full object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-sm">{step.number}</span>
                    </div>
                    <h3 className="text-lg font-bold text-dark-900 uppercase tracking-wide">{step.title}</h3>
                    <p className="mt-2 text-sm text-dark-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
