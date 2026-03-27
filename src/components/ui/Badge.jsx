import { clsx } from 'clsx'

const VARIANTS = {
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  danger:  'bg-danger-bg  text-danger-text',
  info:    'bg-info-bg    text-info-text',
}

/**
 * Status / label pill. `variant` matches keys from `getStatusConfig` in `statusHelpers`.
 *
 * @param {{
 *   variant?: keyof VARIANTS,
 *   children: React.ReactNode,
 *   className?: string,
 * }} props
 */
export function Badge({ children, variant = 'info', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}