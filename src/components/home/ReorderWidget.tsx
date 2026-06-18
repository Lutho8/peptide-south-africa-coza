import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const SHOP_URL =
  'https://peptide-south-africa.com/products?utm_source=tracker&utm_medium=dashboard&utm_campaign=reorder';

export function ReorderWidget() {
  return (
    <motion.a
      href={SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="block rounded-xl bg-card border border-border p-4 shadow-md"
      style={{ borderLeft: '3px solid #06b6d4' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#06b6d4]/15">
          <ShoppingBag size={18} className="text-[#06b6d4]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Running Low?</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Reorder your protocol in one tap.
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#06b6d4]">
            Shop Now <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
