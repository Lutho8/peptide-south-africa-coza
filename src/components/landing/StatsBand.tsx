import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

const counters = [
  { end: 2100, suffix: '+', label: 'Protocols Created' },
  { end: 8500, suffix: '+', label: 'Doses Calculated' },
  { end: 14000, suffix: '+', label: 'Research Queries' },
];

function Counter({ end, suffix, label }: (typeof counters)[number]) {
  const { ref, formattedValue } = useCountUp({
    end,
    suffix,
    duration: 1500,
    enableScrollTrigger: true,
  });

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
        {formattedValue}
      </div>
      <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsBand() {
  return (
    <section className="relative border-y border-border/50 bg-gradient-to-b from-background to-muted/20 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Thousands of protocols, doses, and research hours —{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                logged.
              </span>
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Researchers worldwide use Ride The Tide to plan, track, and refine their protocols.
            </p>
          </motion.div>

          {/* Divider (desktop only) */}
          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-6">
            <div className="absolute -left-8 top-1/2 hidden h-24 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-border to-transparent md:block" />
            {counters.map((c) => (
              <Counter key={c.label} {...c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
