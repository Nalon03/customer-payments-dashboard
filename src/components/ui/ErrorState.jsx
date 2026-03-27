import { AlertTriangle } from 'lucide-react'
import { Button }        from './Button'

/**
 * Inline error panel; `message` should already be a plain string (e.g. from `apiClient`).
 *
 * @param {{
 *   message?: string,
 *   onRetry?: () => void,
 * }} props
 */
export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center mb-4">
        <AlertTriangle size={22} className="text-danger-text" />
      </div>
      <p className="text-sm font-medium text-neutral-700">Unable to load data</p>
      <p className="text-xs text-neutral-400 mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-4"
        >
          Try again
        </Button>
      )}
    </div>
  )
}