import { motion } from 'framer-motion';
import {
  Database,
  Calculator,
  LineChart,
  ShieldCheck,
  Layers,
  Video,
} from 'lucide-react';

const features = [
  {
    title: 'Peptide Research Database',
    desc: '98+ research-grade profiles with mechanisms, dosing protocols, and clinical citations.',
    icon: Database,
    className:
      'md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary to-accent text-primary-foreground',
    iconWrap: 'bg-white/15 text-primary-foreground',
    titleClass: 'text-2xl md:text-3xl',
    descClass: 'text-primary-foreground/85',
    preview: '98+ profiles · 22+ citations · 17 FDA-approved',
  },
  {
    title: 'Smart Calculators',
    desc: 'Dose, blend, and reconstitution calculators with precise unit conversions.',
    icon: Calculator,
    className: 'bg-card border border-border/60',
    iconWrap: 'bg-accent/10 text-accent',
  },
  {
    title: 'Protocol Tracking',
    desc: 'Log doses, set schedules, and track adherence with visual progress dashboards.',
    icon: LineChart,
    className: 'bg-accent/5 border border-accent/20',
    iconWrap: 'bg-accent/10 text-accent',
  },
  {
    title: 'COA Verification',
    desc: 'Verify certificate of analysis for your compounds. Know what you’re researching.',
    icon: ShieldCheck,
    className: 'bg-card border border-border/60',
    iconWrap: 'bg-accent/10 text-accent',
  },
  {
    title: 'Blends & Stacks',
    desc: 'Design multi-peptide stacks with interaction awareness and timing optimization.',
    icon: Layers,
    className: 'bg-accent/5 border border-accent/20',
    iconWrap: 'bg-accent/10 text-accent',
  },
  {
    title: 'Expert Q&A',
    desc: 'Exclusive monthly Zoom session for Premium members — bring your protocol questions to a peptide specialist.',
    icon: Video,
    className: 'bg-card border border-border/60',
    iconWrap: 'bg-accent/10 text-accent',
    badge: 'Premium · Live monthly',
  },
];

export function BentoFeatures() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            Key Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              research, track, and optimize
            </span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            From dose calculations to expert Q&A — one platform for your entire peptide journey.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="mx-auto grid max-w-6xl auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-3xl p-6 shadow-sm transition-shadow hover:shadow-xl md:p-7 ${f.className}`}
              >
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.iconWrap}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className={`font-bold ${f.titleClass ?? 'text-lg'}`}>
                  {f.title}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${f.descClass ?? 'text-muted-foreground'}`}>
                  {f.desc}
                </p>

                {f.badge && (
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    {f.badge}
                  </span>
                )}

                {f.preview && (
                  <div className="mt-5 inline-flex rounded-lg bg-white/10 px-3 py-2 font-mono text-xs text-primary-foreground/90 backdrop-blur-sm">
                    {f.preview}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
