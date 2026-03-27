import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { clsx }        from 'clsx'
import { PaymentRow }  from './PaymentRow'
import { EmptyState }  from '../ui/EmptyState'
import { ErrorState }  from '../ui/ErrorState'
import { PAYMENT_COLUMNS } from '../../constants/table'

function SortIcon({ columnKey, sort }) {
  const isActive = sort.key === columnKey
  if (isActive) {
    return sort.direction === 'asc'
      ? <ChevronUp   size={12} className="text-white" strokeWidth={2.5} />
      : <ChevronDown size={12} className="text-white" strokeWidth={2.5} />
  }
  return (
    <ChevronsUpDown
      size={12}
      strokeWidth={2}
      className="text-transparent group-hover:text-white/50 transition-colors"
    />
  )
}

function SkeletonRows({ rows = 6, cols = 6 }) {
  return Array.from({ length: rows }, (_, r) => (
    <tr key={r} className="border-b border-neutral-100">
      {Array.from({ length: cols }, (_, c) => (
        <td key={c} className="px-4 py-3.5">
          <div
            className="h-4 bg-neutral-100 rounded animate-pulse"
            style={{ width: `${[55, 75, 50, 60, 45, 35][c] ?? 55}%` }}
          />
        </td>
      ))}
    </tr>
  ))
}

export function PaymentsTable({
  payments, isLoading, error,
  sort, onSort, onView, onRetry,
}) {
  return (
    <div
      className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 0.06)' }}
    >
      <div className="sm:hidden px-4 py-2 border-b border-neutral-100
                      text-xs text-neutral-400 text-center">
        Scroll horizontally to see all columns
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">

          <thead>
            <tr style={{ background: '#254F22' }}>
              {PAYMENT_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={col.sortable ? () => onSort(col.key) : undefined}
                  className={clsx(
                    'px-4 py-3',
                    'text-[11px] font-semibold tracking-widest uppercase',
                    'text-white/70 whitespace-nowrap select-none',
                    col.sortable &&
                      'cursor-pointer hover:text-white transition-colors group',
                    col.key === 'actions' && 'text-right',
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <SortIcon columnKey={col.key} sort={sort} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <SkeletonRows rows={6} cols={PAYMENT_COLUMNS.length} />
            ) : error ? (
              <tr>
                <td colSpan={PAYMENT_COLUMNS.length} className="p-0">
                  <ErrorState message={error} onRetry={onRetry} />
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={PAYMENT_COLUMNS.length} className="p-0">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              payments.map((payment, i) => (
                <PaymentRow
                  key={payment.PaymentId}
                  payment={payment}
                  index={i}
                  onView={onView}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !error && payments.length > 0 && (
        <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50/60">
          <span className="text-xs text-neutral-400 tabular-nums">
            Showing{' '}
            <span className="font-medium text-neutral-600">
              {payments.length}
            </span>
            {' '}record{payments.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}