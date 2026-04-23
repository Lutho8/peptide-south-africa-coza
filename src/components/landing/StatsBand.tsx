import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

const counters = [
  { end: 2100, suffix: '+', label: 'Protocols Created' },
  { end: 8500, suffix: '+', label: 'Doses Calculated' },
  { end: 14000, suffix: '+', label: 'Research Queries' },
  { end: 1200, suffix: '+', label: 'Monthly Researchers' },
];

function formatNumber(n: number) {
  return n.toLocaleString('en-US');
}

function Counter({ end, suffix, label }: (typeof counters)[number]) {
  const { ref, count } = useCountUp({
    end,
    duration: 1500,
    enableScrollTrigger: true,
  });

  return (
    <div ref={ref} className="text-center">
      <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl tabular-nums">
        {formatNumber(Math.round(count))}{suffix}
      </div>
      <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsBand() {
  return (
    <section className="relative border-y border-border/50 bg-gradient-to-b from-background to-muted/20 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Thousands of protocols, doses, and research hours —{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              logged.
            </span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Trusted by researchers worldwide to plan, track, and refine peptide protocols.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {counters.map((c) => (
            <Counter key={c.label} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
