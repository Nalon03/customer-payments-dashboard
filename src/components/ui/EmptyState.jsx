import { SearchX } from 'lucide-react'

/**
 * Shown when the filtered list has no rows.
 *
 * @param {{ title?: string, description?: string }} props
 */
export function EmptyState({
  title       = 'No payments found',
  description = 'Try adjusting your filters or date range.',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
        <SearchX size={22} className="text-brand-500" />
      </div>
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      <p className="text-xs text-neutral-400 mt-1 max-w-xs">{description}</p>
    </div>
  )
}