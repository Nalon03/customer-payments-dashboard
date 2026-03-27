import { clsx }           from 'clsx'
import { Eye }            from 'lucide-react'
import { Badge }          from '../ui/Badge'
import { formatDate, formatCurrency } from '../../utils/formatters'
import { getStatusConfig }            from '../../utils/statusHelpers'

export function PaymentRow({ payment, onView, index }) {
  const { label, variant } = getStatusConfig(payment.Status)

  return (
    <tr
      className={clsx(
        'border-b border-neutral-100 last:border-0',
        'hover:bg-neutral-50 transition-colors duration-100',
      )}
    >
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-xs font-mono font-medium text-brand-600 tracking-tight">
          {payment.PaymentNumber ?? '—'}
        </span>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center
                       text-[11px] font-semibold shrink-0 select-none"
            style={{
              background: '#e0f0dc',
              color: '#254F22',
            }}
          >
            {payment.Customer?.[0]?.toUpperCase() ?? '?'}
          </span>
          <span className="text-sm text-neutral-800">
            {payment.Customer ?? '—'}
          </span>
        </div>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-sm font-semibold text-neutral-900 tabular-nums">
          {formatCurrency(payment.Amount)}
        </span>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-sm text-neutral-500 tabular-nums">
          {formatDate(payment.PaymentDate)}
        </span>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        {payment.Status != null
          ? <Badge variant={variant}>{label}</Badge>
          : <span className="text-neutral-300 text-sm">—</span>
        }
      </td>

      <td className="px-4 py-3.5 text-right whitespace-nowrap">
        <button
          onClick={() => onView(payment.PaymentId)}
          aria-label={`View details for ${payment.PaymentNumber}`}
          className={clsx(
            'inline-flex items-center gap-1.5',
            'px-3 py-1.5 rounded-md text-xs font-medium',
            'text-brand-700 bg-brand-50 border border-brand-200',
            'hover:bg-brand-100 hover:border-brand-300',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          )}
        >
          <Eye size={12} strokeWidth={1.75} />
          View
        </button>
      </td>
    </tr>
  )
}