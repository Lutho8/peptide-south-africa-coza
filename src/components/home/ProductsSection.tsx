import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { productImages } from "../../lib/assets";

const products = [
  {
    name: "Compounded Tirzepatide",
    description: "Dual GIP/GLP-1 receptor agonist for powerful weight loss and metabolic support.",
    link: "/products/compounded-tirzepatide",
    image: productImages.tirzepatideBottle,
    alt: "Compounded Tirzepatide bottle",
  },
  {
    name: "Compounded Semaglutide",
    description: "GLP-1 receptor agonist proven to reduce appetite and support sustained weight loss.",
    link: "/products/compounded-semaglutide",
    image: productImages.semaglutideBottle,
    alt: "Compounded Semaglutide bottle",
  },
  {
    name: "NAD+",
    description: "Boost cellular energy, repair DNA, and support longevity at the mitochondrial level.",
    link: "/products/nad",
    image: productImages.nadSpray,
    alt: "NAD+ spray bottle",
  },
  {
    name: "Sermorelin",
    description: "Growth hormone secretagogue that supports muscle growth, recovery, and body composition.",
    link: "/products/sermorelin",
    image: productImages.sermorelinVial,
    alt: "Sermorelin vial",
  },
  {
    name: "Glutathione",
    description: "Master antioxidant for immune support, detoxification, and cellular protection.",
    link: "/products/glutathione",
    image: productImages.glutathioneVial,
    alt: "Glutathione vial",
  },
];

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-dark-50">
      <div className="container-main">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight">
            Our Products
          </h2>
          <p className="mt-4 text-lg text-dark-500 leading-relaxed">
            The Peptide South Africa journey starts with a tailored protocol, designed for your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="card-hover overflow-hidden h-full flex flex-col">
                <div className="w-full h-[300px] flex items-center justify-center bg-white rounded-t-2xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-dark-900">{product.name}</h3>
                  <p className="mt-2 text-sm text-dark-500 leading-relaxed flex-1">{product.description}</p>
                  <Link
                    to={product.link}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
