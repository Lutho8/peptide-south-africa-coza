import { motion } from 'framer-motion';
import { Search, Calculator, ClipboardCheck, Video } from 'lucide-react';

const steps = [
  {
    n: '01',
    title: 'Research Your Peptide',
    desc: 'Browse 98+ research-grade profiles with mechanisms, dosing protocols, and clinical citations.',
    icon: Search,
    preview: 'BPC-157 · Tissue Repair · Half-life ~6h',
  },
  {
    n: '02',
    title: 'Build Your Protocol',
    desc: 'Use smart calculators to plan doses, blends, reconstitution, and stacking schedules.',
    icon: Calculator,
    preview: '5mg vial · 2mL BAC · 250mcg → 10 units',
  },
  {
    n: '03',
    title: 'Track & Log Doses',
    desc: 'Set reminders, log injections, and monitor adherence across cycles.',
    icon: ClipboardCheck,
    preview: 'Today · 2/2 doses logged · 92% adherence',
  },
  {
    n: '04',
    title: 'Consult & Optimize',
    desc: 'Premium members join the monthly group Q&A on Zoom to refine their protocol with expert input.',
    icon: Video,
    preview: 'Premium Q&A · 1st Saturday · Members only',
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            How Ride The Tide Works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Your peptide protocol, from{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              research to results
            </span>{' '}
            in 4 steps
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            No spreadsheets. No guesswork. Just structured, evidence-based peptide management.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mx-auto max-w-5xl">
          {/* connecting line desktop */}
          <div className="absolute left-[27px] top-8 bottom-8 hidden w-px bg-gradient-to-b from-primary/40 via-accent/30 to-transparent md:block" />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const reverse = i % 2 === 1;
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: reverse ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative grid items-center gap-6 md:grid-cols-[56px_1fr_1fr] md:gap-8"
                >
                  {/* Number circle */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-base font-bold text-primary-foreground shadow-lg shadow-primary/25">
                    {step.n}
                  </div>

                  {/* Text */}
                  <div className={reverse ? 'md:order-3' : ''}>
                    <h3 className="text-xl font-bold md:text-2xl">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base">
                      {step.desc}
                    </p>
                  </div>

                  {/* UI mini-card */}
                  <div className={reverse ? 'md:order-2' : ''}>
                    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Step {step.n}
                          </div>
                          <div className="text-sm font-mono text-foreground/80">
                            {step.preview}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
