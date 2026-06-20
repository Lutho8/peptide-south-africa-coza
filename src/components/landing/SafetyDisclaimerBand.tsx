import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown } from 'lucide-react';

const POINTS = [
  'All peptides discussed are research compounds. They are NOT FDA-approved for human consumption.',
  'Nothing in this app is medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before starting, stopping, or changing any protocol.',
  'Start with the lowest effective dose, titrate slowly, and never combine compounds without understanding the interactions.',
  'Run baseline bloodwork before a cycle and at least every 8–12 weeks during use. Stop immediately if you experience adverse effects.',
  'Do not use if you are pregnant, breastfeeding, under 21, or being treated for a serious medical condition (cancer, cardiovascular disease, endocrine disorders) without specialist supervision.',
  'Source from vendors with verified third-party Certificates of Analysis (COA). Purity and identity matter as much as dose.',
];

export function SafetyDisclaimerBand() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto rounded-2xl border border-yellow-500/30 bg-yellow-500/[0.07] backdrop-blur-sm overflow-hidden"
        >
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-start md:items-center gap-4 p-5 md:p-6 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-bold text-yellow-100">
                Research-use only — not medical advice
              </h3>
              <p className="text-xs md:text-sm text-yellow-200/80 mt-1">
                Peptides are not FDA-approved. Always consult a qualified healthcare professional before use.
              </p>
            </div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 self-center"
            >
              <ChevronDown className="w-5 h-5 text-yellow-400" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 md:px-6 pb-6 pt-0">
                  <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mb-5" />
                  <ul className="space-y-3">
                    {POINTS.map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm text-yellow-100/85 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
