import { motion } from 'framer-motion';
import { getAllCategories, PeptideCategory } from '@/data/peptides';

interface HeroCategoryBadgesProps {
  onCategoryClick?: (category: PeptideCategory) => void;
}

export function HeroCategoryBadges({ onCategoryClick }: HeroCategoryBadgesProps) {
  const categories = getAllCategories();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-12"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Categories</h3>
      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryClick?.(category.id)}
            className={`
              ${category.bgColor} 
              border border-border/50 
              rounded-full 
              px-4 py-2 
              flex items-center gap-2
              hover:border-accent/50 
              transition-all 
              group
            `}
          >
            <span className={`text-sm font-medium ${category.color}`}>
              {category.label}
            </span>
            <span className="bg-background/50 rounded-full px-2 py-0.5 text-xs text-muted-foreground">
              {category.count}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
