import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { activeStack } from '@/data/userData';
import { peptides, PeptideCategory } from '@/data/peptides';

export function StackCategories() {
  const categoryCounts: Partial<Record<PeptideCategory, number>> = {};

  activeStack.forEach(item => {
    const peptide = peptides.find(p => p.id === item.peptideId);
    if (peptide) {
      categoryCounts[peptide.category] = (categoryCounts[peptide.category] || 0) + 1;
    }
  });

  // Only show categories that exist in the user's active stack
  const activeCategories = Object.keys(categoryCounts) as PeptideCategory[];

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Stack Categories</h3>
      <div className="flex flex-wrap gap-2">
        {activeCategories.map((category) => (
          <CategoryBadge
            key={category}
            category={category}
            count={categoryCounts[category] || 0}
            size="sm"
          />
        ))}
        {activeCategories.length === 0 && (
          <p className="text-sm text-muted-foreground">No peptides in stack</p>
        )}
      </div>
    </div>
  );
}
