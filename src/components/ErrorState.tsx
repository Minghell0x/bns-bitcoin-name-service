interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-error/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-3xl text-error">error_outline</span>
      </div>
      <h3 className="text-xl font-bold font-headline mb-2">Something went wrong</h3>
      <p className="text-on-surface-variant text-sm max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-surface-bright transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
