import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Peptide South Africa?",
    answer: "Peptide South Africa is a licensed telehealth platform for personalized peptide therapy. We connect you with licensed physicians who design custom protocols compounded at SAHPRA-compliant pharmacies.",
  },
  {
    question: "Are your peptides legal in South Africa?",
    answer: "Yes. All protocols are prescribed by licensed South African physicians and compounded at licensed pharmacies under SAHPRA guidelines.",
  },
  {
    question: "Do I need a prescription?",
    answer: "Yes. All peptide therapies require a valid prescription from a licensed physician. Our platform handles this through our online consultation process.",
  },
  {
    question: "How long until I see results?",
    answer: "Results vary by individual and protocol. Most patients report initial changes within 2-4 weeks, with significant results typically appearing by week 12.",
  },
  {
    question: "Is peptide therapy safe?",
    answer: "When prescribed and supervised by a licensed physician, peptide therapy is generally safe. Our protocols include regular monitoring and adjustments.",
  },
  {
    question: "What is the difference between Tirzepatide and Semaglutide?",
    answer: "Tirzepatide is a dual GIP/GLP-1 receptor agonist, while Semaglutide is a GLP-1 receptor agonist. Tirzepatide may offer enhanced weight loss benefits.",
  },
  {
    question: "How are your peptides compounded?",
    answer: "Our partner pharmacies compound peptides using pharmaceutical-grade ingredients in sterile facilities, following strict quality control protocols.",
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a 30-day satisfaction guarantee on your first protocol. If you're not satisfied, contact our care team for a full refund.",
  },
  {
    question: "How do I administer my peptides?",
    answer: "Your protocol includes detailed administration instructions. Most peptides are administered via subcutaneous injection. We provide video guides and support.",
  },
  {
    question: "Can I combine multiple peptides?",
    answer: "Yes, many patients benefit from stacked protocols. Your physician will determine the safest and most effective combination for your goals.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-dark-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 px-2 text-left group"
      >
        <span className="font-semibold text-dark-900 text-base md:text-lg pr-4 group-hover:text-primary-600 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-dark-500 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 px-2 text-dark-500 leading-relaxed text-sm md:text-base max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding bg-dark-50">
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight">
            FAQ
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
