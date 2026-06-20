import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { partnerImages } from "../../lib/assets";
import { Play } from "lucide-react";

const partners = [
  { name: "Wasef Health", src: partnerImages.wasefHealth },
  { name: "San Antonio Marathon", src: partnerImages.sanAntonioMarathon },
  { name: "PepGuide", src: partnerImages.pepguide },
  { name: "Rawdawg Run Club", src: partnerImages.rawdawgRunClub },
  { name: "ERX", src: partnerImages.erx },
  { name: "Integrated Care", src: partnerImages.integratedCare },
  { name: "Exercise is Bullshit", src: partnerImages.exerciseIsBullshit },
  { name: "Bask", src: partnerImages.bask },
  { name: "Hillside Morning", src: partnerImages.hillsideMorning },
];

const testimonialVideos = [
  "https://player.vimeo.com/progressive_redirect/playback/1197576794/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&signature=17601266ee7e2cb1ad78cd417676683352bfc62cb32be03b087f5ee446fd2484",
  "https://player.vimeo.com/progressive_redirect/playback/1197885475/rendition/540p/file.mp4%20(540p).mp4?loc=external&signature=a0fce7e26dc59facdb80bc6c56a5895113743940b784b9b6d60c74628763c8a1",
  "https://player.vimeo.com/progressive_redirect/playback/1198867017/rendition/360p/file.mp4%20%28360p%29.mp4?loc=external&signature=4b05aa047ec26a22abab970319ba306b9eaea53446dc535ea2886aeb688e850f",
  "https://player.vimeo.com/progressive_redirect/playback/1197885503/rendition/540p/file.mp4%20(540p).mp4?loc=external&signature=63ade134ad600c601acbe85f9dab5c4ca74f6a810b0d24e8f8e5e3ac79c13884",
  "https://player.vimeo.com/progressive_redirect/playback/1197928742/rendition/540p/file.mp4%20%28540p%29.mp4?loc=external&signature=78ef70209070004774f30bc4532296b564b11d660adac0d7cd3986f1746c97a7",
];

function LogoMarquee() {
  const marqueeContent = (
    <>
      {partners.map((partner) => (
        <div
          key={partner.name}
          className="flex items-center justify-center px-6 md:px-8 shrink-0"
        >
          <img
            src={partner.src}
            alt={partner.name}
            className="h-8 md:h-10 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            loading="lazy"
          />
        </div>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden py-5 border-b border-dark-100">
      <div className="flex animate-marquee">
        <div className="flex shrink-0">{marqueeContent}</div>
        <div className="flex shrink-0">{marqueeContent}</div>
        <div className="flex shrink-0">{marqueeContent}</div>
        <div className="flex shrink-0">{marqueeContent}</div>
      </div>
    </div>
  );
}

function VideoCard({ src }: { src: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-dark-900 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-300">
          <Play className="w-6 h-6 text-dark-900 fill-dark-900 ml-1" />
        </div>
      </div>
    </div>
  );
}

export default function TrustedMarquee() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section>
      {/* Part A: Logo Marquee */}
      <div className="bg-white pt-10 md:pt-14">
        <div className="container-main text-center mb-8">
          <p className="text-sm font-semibold tracking-widest uppercase text-dark-400">
            Trusted by the world&apos;s leading doers
          </p>
        </div>
        <LogoMarquee />
      </div>

      {/* Part B: Testimonial Video Swiper */}
      <div ref={ref} className="section-padding bg-dark-50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight">
              Verified 5-Star Reviews for Peptide South Africa
            </h2>
            <p className="mt-4 text-lg text-dark-500 leading-relaxed">
              The support people keep coming back to.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1.2}
              breakpoints={{
                768: { slidesPerView: 3 },
              }}
              loop
            >
              {testimonialVideos.map((src, i) => (
                <SwiperSlide key={i}>
                  <VideoCard src={src} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
