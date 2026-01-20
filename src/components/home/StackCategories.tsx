import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { activeStack } from '@/data/userData';
import { peptides, PeptideCategory } from '@/data/peptides';

export function StackCategories() {
  const categoryCounts: Record<PeptideCategory, number> = {
    'immune': 0,
    'longevity': 0,
    'cognitive': 0,
    'metabolic': 0,
    'healing': 0,
    'gh-secretagogue': 0
  };

  activeStack.forEach(item => {
    const peptide = peptides.find(p => p.id === item.peptideId);
    if (peptide) {
      categoryCounts[peptide.category]++;
    }
  });

  const categories: PeptideCategory[] = ['immune', 'longevity', 'cognitive', 'metabolic', 'healing', 'gh-secretagogue'];

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Stack Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <CategoryBadge
            key={category}
            category={category}
            count={categoryCounts[category]}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}
