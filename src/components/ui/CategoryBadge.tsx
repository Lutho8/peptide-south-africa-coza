import { cn } from '@/lib/utils';
import { PeptideCategory, getCategoryLabel, getCategoryGradient } from '@/data/peptides';

interface CategoryBadgeProps {
  category: PeptideCategory;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  onClick?: () => void;
}

export function CategoryBadge({ 
  category, 
  count, 
  size = 'md', 
  showCount = true,
  onClick 
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium text-white transition-all duration-200 hover:opacity-90 hover:scale-105",
        getCategoryGradient(category),
        sizeClasses[size],
        onClick && "cursor-pointer"
      )}
    >
      <span>{getCategoryLabel(category)}</span>
      {showCount && count !== undefined && (
        <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
