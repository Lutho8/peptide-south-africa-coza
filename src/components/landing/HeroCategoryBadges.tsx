import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { getAllCategories, PeptideCategory } from '@/data/peptides';
import { useState, useRef } from 'react';

interface HeroCategoryBadgesProps {
  onCategoryClick?: (category: PeptideCategory) => void;
}

// Floating badge with magnetic hover effect
function FloatingBadge({ 
  category, 
  index, 
  onClick 
}: { 
  category: ReturnType<typeof getAllCategories>[0]; 
  index: number; 
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const badgeRef = useRef<HTMLButtonElement>(null);
  
  // Magnetic hover effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * 0.15;
    const distY = (e.clientY - centerY) * 0.15;
    x.set(distX);
    y.set(distY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleClick = () => {
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
    onClick?.();
  };

  // Random float offset for each badge
  const floatOffset = (index % 3) * 0.5;

  return (
    <motion.button
      ref={badgeRef}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: [0, -6, 0],
      }}
      transition={{ 
        opacity: { duration: 0.3, delay: 0.4 + index * 0.05 },
        scale: { duration: 0.3, delay: 0.4 + index * 0.05 },
        y: { 
          duration: 3 + floatOffset, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: floatOffset,
        },
      }}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`
        ${category.bgColor} 
        border border-border/50 
        rounded-full 
        px-4 py-2 
        flex items-center gap-2
        hover:border-accent/50 
        transition-all 
        group
        relative
        overflow-hidden
      `}
    >
      {/* Ripple effect */}
      {showRipple && (
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/20"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
      
      <span className={`text-sm font-medium ${category.color} relative z-10`}>
        {category.label}
      </span>
      <motion.span 
        className="bg-background/50 rounded-full px-2 py-0.5 text-xs text-muted-foreground relative z-10"
        animate={isHovered ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {category.count}
      </motion.span>
    </motion.button>
  );
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
          <FloatingBadge
            key={category.id}
            category={category}
            index={index}
            onClick={() => onCategoryClick?.(category.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
