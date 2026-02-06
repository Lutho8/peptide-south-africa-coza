import { Skeleton } from '@/components/ui/skeleton';

export function HomeSkeleton() {
  return (
    <div className="pb-24 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      {/* News ticker */}
      <Skeleton className="h-10 w-full rounded-lg" />
      {/* Cards */}
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-36 w-full rounded-xl" />
      ))}
      {/* Quick actions grid */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="pb-24 space-y-4 animate-in fade-in duration-300">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="pb-24 space-y-4 animate-in fade-in duration-300">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
