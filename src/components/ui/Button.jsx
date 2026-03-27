import { clsx } from 'clsx'

const VARIANTS = {
  primary:   'bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800 focus-visible:ring-brand-500',
  secondary: 'bg-brand-100 text-brand-800 hover:bg-brand-200 active:bg-brand-300 focus-visible:ring-brand-400',
  ghost:     'bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100 focus-visible:ring-brand-400',
  danger:    'bg-danger-bg text-danger-text hover:opacity-90 focus-visible:ring-red-400',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2   text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
}

/**
 * @param {{
 *   variant?: keyof VARIANTS,
 *   size?: keyof SIZES,
 *   isLoading?: boolean,
 *   icon?: React.ReactNode,
 *   className?: string,
 * } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...rest
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-md',
        'transition-colors duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  )
}