import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  activeCategory: string;
}

export default function FAQAccordion({ items, activeCategory }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {filtered.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="bg-white rounded-xl border border-dark-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-5 text-left"
              >
                <span className="font-semibold text-dark-900 text-sm md:text-base pr-4">{item.question}</span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-4 h-4 text-primary-600" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 md:px-6 md:pb-6 text-dark-500 text-sm leading-relaxed border-t border-dark-50 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
