import { clsx } from 'clsx'

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-10 h-10 border-[3px]',
}

/**
 * Loading indicator with `role="status"` and `aria-label` for screen readers.
 *
 * @param {{
 *   size?: keyof SIZES,
 *   className?: string,
 *   label?: string,
 * }} props
 */
export function Spinner({ size = 'md', className, label = 'Loading…' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={clsx(
        'inline-block rounded-full animate-spin',
        'border-brand-200 border-t-brand-700',
        SIZES[size],
        className,
      )}
    />
  )
}