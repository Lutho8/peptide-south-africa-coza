import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { buildStackCartLink } from '@/lib/shop/buildStackCartLink';
import { trackBwEvent } from '@/lib/bloodwork/analytics';

interface BuyStackCardProps {
  items: { peptideId: string; name?: string }[];
  /** Optional medium tag for UTM analytics (e.g. 'my_stack', 'home') */
  medium?: string;
  /** Sub-label below the title */
  subtitle?: string;
}

/**
 * In-dashboard "Buy this stack" CTA. Opens the Ride The Tide store cart
 * with every peptide in the user's active stack pre-loaded. One tap.
 */
export function BuyStackCard({ items, medium = 'my_stack', subtitle }: BuyStackCardProps) {
  if (!items.length) return null;
  const url = buildStackCartLink(items, { medium });
  const count = items.length;

  const handleClick = () => {
    trackBwEvent('bw_checkout_clicked', {
      peptides: items.map((i) => i.peptideId),
      patterns: [],
    });
  };

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative block overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-4 shadow-lg shadow-primary/10"
    >
      {/* Shimmer sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-y-4 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition group-hover:translate-x-[400%] group-hover:opacity-100 duration-1000"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <ShoppingBag size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              One-tap reorder
            </p>
          </div>
          <h3 className="mt-0.5 text-base font-bold leading-tight text-foreground">
            Buy this stack
          </h3>
          <p className="text-xs text-muted-foreground">
            {subtitle ?? `${count} peptide${count === 1 ? '' : 's'} · ships from www.ridethetide.site`}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition group-hover:scale-110">
          <ArrowRight size={18} />
        </div>
      </div>
    </motion.a>
  );
}
