import { motion } from 'framer-motion';
import { CheckCircle2, Scale, FlaskConical, Star } from 'lucide-react';

/**
 * Glassmorphism cards floating around the phone mockup.
 * Each card uses subtle infinite float + on-load stagger.
 */
const float = {
  animate: {
    y: [0, -8, 0],
  },
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut',
  },
} as const;

function GlassCard({
  children,
  className = '',
  delay = 0,
  floatDelay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  floatDelay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="rounded-2xl border border-border/40 bg-card/70 p-3 shadow-2xl backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function FloatingStatCards() {
  return (
    <>
      {/* Adherence — top left */}
      <GlassCard delay={0.8} floatDelay={0} className="-left-4 top-10 sm:-left-12 sm:top-16">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15">
            <CheckCircle2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="text-[10px] font-medium text-muted-foreground">Adherence</div>
            <div className="text-sm font-bold text-foreground">92%</div>
          </div>
        </div>
      </GlassCard>

      {/* Weight — middle right */}
      <GlassCard delay={1.0} floatDelay={1} className="-right-6 top-32 sm:-right-16 sm:top-40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-[10px] font-medium text-muted-foreground">Current weight</div>
            <div className="text-sm font-bold text-foreground">87.5 kg</div>
            <svg viewBox="0 0 60 16" className="mt-0.5 h-3 w-16">
              <polyline
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="1.5"
                strokeLinecap="round"
                points="0,12 10,10 20,11 30,7 40,8 50,4 60,5"
              />
            </svg>
          </div>
        </div>
      </GlassCard>

      {/* Active protocols — bottom left */}
      <GlassCard delay={1.2} floatDelay={2} className="-left-2 bottom-24 sm:-left-10 sm:bottom-32">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-[10px] font-medium text-muted-foreground">Active</div>
            <div className="text-sm font-bold text-foreground">2 Protocols</div>
          </div>
        </div>
      </GlassCard>

      {/* Rating — bottom center */}
      <GlassCard
        delay={1.4}
        floatDelay={1.5}
        className="-bottom-4 left-1/2 -translate-x-1/2 sm:-bottom-6"
      >
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
            ))}
          </div>
          <div className="text-xs font-semibold text-foreground">5.0</div>
          <div className="text-[10px] text-muted-foreground">(218+)</div>
        </div>
      </GlassCard>
    </>
  );
}
