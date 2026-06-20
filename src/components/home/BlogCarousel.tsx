import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { blogImages } from "../../lib/assets";

const blogs = [
  { title: "Sermorelin Dosage for Muscle Growth and Body Composition", category: "Growth", readTime: "5 min", image: blogImages.sermorelinDosage, alt: "Sermorelin dosage guide" },
  { title: "Microdosing Semaglutide: A Smarter, Lower-Dose Approach to Weight Loss", category: "Weight Loss", readTime: "7 min", image: blogImages.microdosingSemaglutide, alt: "Microdosing Semaglutide" },
  { title: "NAD Injections vs Oral Pills", category: "Longevity", readTime: "4 min", image: blogImages.nadInjectionsVsPills, alt: "NAD injections vs pills" },
  { title: "What Are Glutathione Injections? Benefits, Risks, and a Smarter Alternative", category: "Immune", readTime: "6 min", image: blogImages.glutathioneInjections, alt: "Glutathione injections" },
  { title: "Compounded Tirzepatide", category: "Weight Loss", readTime: "5 min", image: blogImages.compoundedTirzepatide, alt: "Compounded Tirzepatide" },
  { title: "Compounded Semaglutide", category: "Weight Loss", readTime: "5 min", image: blogImages.compoundedSemaglutide, alt: "Compounded Semaglutide" },
  { title: "Sermorelin Prescription", category: "Growth", readTime: "4 min", image: blogImages.sermorelinPrescription, alt: "Sermorelin prescription" },
  { title: "NAD Injection Benefits", category: "Longevity", readTime: "6 min", image: blogImages.nadInjectionBenefits, alt: "NAD injection benefits" },
  { title: "When is the Best Time to Take Glutathione", category: "Immune", readTime: "4 min", image: blogImages.glutathioneTiming, alt: "Best time to take Glutathione" },
  { title: "Microdosing Tirzepatide", category: "Weight Loss", readTime: "6 min", image: blogImages.microdosingTirzepatide, alt: "Microdosing Tirzepatide" },
  { title: "Peptides for Weight Loss in Women", category: "Weight Loss", readTime: "7 min", image: blogImages.peptidesWeightLossWomen, alt: "Peptides for weight loss in women" },
];

export default function BlogCarousel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight">
            Get your dose of science.
          </h2>
          <p className="mt-4 text-lg text-dark-500 leading-relaxed uppercase tracking-widest text-sm font-semibold">
            Expert Insights on Health, Wellness & Peptides
          </p>
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
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            loop
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.title}>
                <Link to="/blogs" className="block group">
                  <div className="card-hover overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                          {blog.category}
                        </span>
                        <span className="text-xs text-dark-400">{blog.readTime} read</span>
                      </div>
                      <h3 className="text-sm font-bold text-dark-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
