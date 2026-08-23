interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-leaf-100/50 rounded-2xl ${className} relative overflow-hidden`}>
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-soft border border-leaf-100/50 p-6 relative overflow-hidden">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
