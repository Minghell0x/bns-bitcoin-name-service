interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'domain' | 'page'
}

export default function LoadingSkeleton({ type = 'card' }: LoadingSkeletonProps) {
  if (type === 'page') {
    return (
      <div className="flex-grow flex items-center justify-center pt-32 pb-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-mono text-outline uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    )
  }

  if (type === 'domain') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-64 bg-surface-container-highest rounded-lg" />
        <div className="h-6 w-48 bg-surface-container-high rounded" />
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="h-24 bg-surface-container rounded-lg" />
          <div className="h-24 bg-surface-container rounded-lg" />
          <div className="h-24 bg-surface-container rounded-lg" />
        </div>
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 w-3/4 bg-surface-container-highest rounded" />
        <div className="h-4 w-1/2 bg-surface-container-high rounded" />
      </div>
    )
  }

  return (
    <div className="animate-pulse bg-surface-container-low rounded-lg p-8">
      <div className="h-6 w-1/3 bg-surface-container-highest rounded mb-4" />
      <div className="h-4 w-2/3 bg-surface-container-high rounded mb-2" />
      <div className="h-4 w-1/2 bg-surface-container rounded" />
    </div>
  )
}
