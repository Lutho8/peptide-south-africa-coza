import { GradientCard } from '@/components/ui/GradientCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Layers } from 'lucide-react';

export function StackPreviewSkeleton() {
  return (
    <GradientCard className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Layers size={20} className="text-primary/60" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 shimmer-sweep" />
            <Skeleton className="h-3 w-20 shimmer-sweep" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-lg shimmer-sweep" />
        ))}
      </div>
    </GradientCard>
  );
}
