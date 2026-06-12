import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Star } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonials = [
  {
    name: "Nic K",
    text: "I've been peptide-curious for a long time but was always scared of sketchy gray market sites and dosing myself. Ride The Tide gave me a personalized protocol with the security of medical supervision instead of self science.",
  },
  {
    name: "Rhys S",
    text: "I was pre-diabetic and now my labs are normal in just 14 weeks.",
  },
  {
    name: "Morgan J",
    text: "I had tried many diets, supplements and weight loss plans in the past. Finally, I decided to have a physician-tailored protocol drawn up for me by the Ride The Tide Care Team and I was able to achieve my weight loss goals.",
  },
  {
    name: "Chase H",
    text: "My doctor struggled to accurately diagnose my fatigue, but my Ride The Tide protocol helped me feel like my old self again.",
  },
  {
    name: "Aubrey H",
    text: "The first couple weeks took some adjusting, but the team walked me through it and I'm really glad I went the supervised route.",
  },
  {
    name: "Cody M",
    text: "Ride The Tide and my dedicated health coach have completely changed the way I approach my health, leading me to newfound progress and balance.",
  },
  {
    name: "Michael M",
    text: "My Ride The Tide protocol has helped support my health journey. After years of working out, this support has finally led to noticeable results.",
  },
];

function StarRating() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding bg-dark-50">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight">
            What our patients say
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <div className="card-hover p-6 h-full flex flex-col">
                  <StarRating />
                  <p className="mt-4 text-dark-600 leading-relaxed text-sm flex-1">"{t.text}"</p>
                  <p className="mt-6 font-bold text-dark-900 text-sm">— {t.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
