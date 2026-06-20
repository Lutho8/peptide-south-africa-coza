import { motion } from 'framer-motion';
import { ShieldCheck, MessageCircle, RefreshCcw } from 'lucide-react';

const pillars = [
  { icon: ShieldCheck, label: 'Secure Checkout', sub: 'PCI-compliant' },
  { icon: () => <span className="text-2xl leading-none">🇿🇦</span>, label: 'South African Owned', sub: 'Built locally' },
  { icon: RefreshCcw, label: 'Cancel Anytime', sub: 'No lock-in' },
  { icon: MessageCircle, label: 'WhatsApp & Email Support', sub: 'Real humans' },
];

export function PricingTrustBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mt-8">
      {pillars.map((p, i) => {
        const Icon = p.icon as React.ComponentType<{ className?: string }>;
        return (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs md:text-sm font-semibold text-foreground leading-tight">
                {p.label}
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground leading-tight">
                {p.sub}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
