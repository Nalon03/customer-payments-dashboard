// src/components/payments/PaymentsTable.jsx
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
      ? <ChevronUp   size={12} color="white" strokeWidth={2.5} />
      : <ChevronDown size={12} color="white" strokeWidth={2.5} />
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
    <tr key={r} style={{ borderBottom: '1px solid #f1f5f9' }}>
      {Array.from({ length: cols }, (_, c) => (
        <td key={c} style={{ padding: '14px 16px' }}>
          <div
            className="animate-pulse"
            style={{
              height: '14px',
              backgroundColor: '#f1f5f9',
              borderRadius: '4px',
              width: `${[55, 75, 50, 60, 45, 35][c] ?? 55}%`,
            }}
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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>

      {/* Mobile hint */}
      <div className="sm:hidden" style={{
        padding: '8px 16px',
        borderBottom: '1px solid #f1f5f9',
        fontSize: '11px',
        color: '#94a3b8',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        Scroll horizontally to see all columns
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
        }}>

          {/* Header */}
          <thead>
            <tr style={{ backgroundColor: '#254F22' }}>
              {PAYMENT_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={col.sortable ? () => onSort(col.key) : undefined}
                  className={col.sortable ? 'group' : ''}
                  style={{
                    padding: '12px 16px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.65)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    cursor: col.sortable ? 'pointer' : 'default',
                    textAlign: col.key === 'actions' ? 'right' : 'left',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (col.sortable) e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    if (col.sortable) e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {col.label}
                    {col.sortable && <SortIcon columnKey={col.key} sort={sort} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              <SkeletonRows rows={6} cols={PAYMENT_COLUMNS.length} />
            ) : error ? (
              <tr>
                <td colSpan={PAYMENT_COLUMNS.length} style={{ padding: 0 }}>
                  <ErrorState message={error} onRetry={onRetry} />
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={PAYMENT_COLUMNS.length} style={{ padding: 0 }}>
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

      {/* Footer */}
      {!isLoading && !error && payments.length > 0 && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#fafafa',
          fontSize: '12px',
          color: '#94a3b8',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          Showing{' '}
          <span style={{ fontWeight: 500, color: '#475569' }}>
            {payments.length}
          </span>
          {' '}record{payments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}