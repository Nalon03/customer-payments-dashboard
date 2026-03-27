import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { PaymentRow }  from './PaymentRow'
import { EmptyState }  from '../ui/EmptyState'
import { ErrorState }  from '../ui/ErrorState'
import { PAYMENT_COLUMNS } from '../../constants/table'

const BRAND = '#254F22'
const BORDER = '#e2e8f0'
const MUTED = '#94a3b8'
const TEXT = '#475569'
const FOOTER_BG = '#fafafa'

/**
 * Builds page numbers (and ellipsis markers) for the pager control.
 * @param {number} current - 1-based current page
 * @param {number} total - total page count
 * @returns {(number|'ellipsis')[]}
 */
function buildPageItems(current, total) {
  if (total <= 1) return [1]
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const set = new Set([1, total])
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) set.add(p)
  }
  const sorted = [...set].sort((a, b) => a - b)
  const out = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const gap = sorted[i] - sorted[i - 1]
      if (gap > 1) out.push('ellipsis')
    }
    out.push(sorted[i])
  }
  return out
}

function SortIcon({ columnKey, sort }) {
  const isActive = sort.key === columnKey
  if (isActive) {
    return sort.direction === 'asc'
      ? <ChevronUp   size={13} color="white" strokeWidth={2.5} />
      : <ChevronDown size={13} color="white" strokeWidth={2.5} />
  }
  return (
    <ChevronsUpDown
      size={13}
      strokeWidth={2}
      className="text-transparent group-hover:text-white/50 transition-colors"
    />
  )
}

function SkeletonRows({ rows = 6, cols = 6 }) {
  return Array.from({ length: rows }, (_, r) => (
    <tr key={r} style={{ borderBottom: '1px solid #f1f5f9' }}>
      {Array.from({ length: cols }, (_, c) => (
        <td key={c} style={{ padding: '10px 12px' }}>
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

function pagerBtnStyle(active, disabled) {
  return {
    minWidth: '34px',
    height: '30px',
    padding: '0 8px',
    fontSize: '12px',
    fontWeight: active ? 600 : 500,
    fontFamily: 'Inter, system-ui, sans-serif',
    border: `1px solid ${BORDER}`,
    borderRadius: '6px',
    backgroundColor: active ? BRAND : 'white',
    color: active ? 'white' : TEXT,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background-color 0.15s, color 0.15s, border-color 0.15s',
  }
}

export function PaymentsTable({
  payments, isLoading, error,
  sort, onSort, onView, onRetry,
  pagination,
  onPageChange,
  onRowsPerPageChange,
}) {
  const currentPage = pagination?.currentPage ?? 1
  const totalPages = pagination?.totalPages ?? 1
  const rowsPerPage = pagination?.rowsPerPage ?? 10
  const options = pagination?.rowsPerPageOptions ?? [10, 25, 50]
  const totalCount = pagination?.totalCount ?? 0

  const showPager = !isLoading && !error && totalCount > 0 && totalPages > 1
  const showRowsSelect = !isLoading && !error && totalCount > 0

  const pageItems = buildPageItems(currentPage, totalPages)

  function goFirst() {
    if (currentPage <= 1) return
    onPageChange?.(1)
  }

  function goPrev() {
    if (currentPage <= 1) return
    onPageChange?.(currentPage - 1)
  }

  function goNext() {
    if (currentPage >= totalPages) return
    onPageChange?.(currentPage + 1)
  }

  function goLast() {
    if (currentPage >= totalPages) return
    onPageChange?.(totalPages)
  }

  /** Empty result set: show `EmptyState` instead of the table shell (no column headers). */
  const showTableEmpty = !isLoading && !error && payments.length === 0

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: `1px solid ${BORDER}`,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>

      {showTableEmpty ? (
        <EmptyState />
      ) : (
        <>
          <div className="sm:hidden" style={{
            padding: '6px 12px',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '11px',
            color: MUTED,
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

              <thead>
                <tr style={{ backgroundColor: BRAND }}>
                  {PAYMENT_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      onClick={col.sortable ? () => onSort(col.key) : undefined}
                      className={col.sortable ? 'group' : ''}
                      style={{
                        padding: '13px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.65)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.055em',
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

              <tbody>
                {isLoading ? (
                  <SkeletonRows rows={6} cols={PAYMENT_COLUMNS.length} />
                ) : error ? (
                  <tr>
                    <td colSpan={PAYMENT_COLUMNS.length} style={{ padding: 0 }}>
                      <ErrorState message={error} onRetry={onRetry} />
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
        </>
      )}

      {!isLoading && !error && totalCount > 0 && (
        <div
          role="navigation"
          aria-label="Table pagination"
          style={{
            padding: '10px 12px',
            borderTop: '1px solid #f1f5f9',
            backgroundColor: FOOTER_BG,
            fontSize: '12px',
            color: MUTED,
            fontFamily: 'Inter, system-ui, sans-serif',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            {showRowsSelect && (
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: TEXT,
                fontSize: '12px',
              }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>Rows per page</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
                  style={{
                    height: '30px',
                    padding: '0 24px 0 8px',
                    fontSize: '12px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: TEXT,
                    border: `1px solid ${BORDER}`,
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  }}
                >
                  {options.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {showPager && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                aria-label="First page"
                style={pagerBtnStyle(false, currentPage <= 1)}
                disabled={currentPage <= 1}
                onClick={goFirst}
              >
                First
              </button>
              <button
                type="button"
                aria-label="Previous page"
                style={pagerBtnStyle(false, currentPage <= 1)}
                disabled={currentPage <= 1}
                onClick={goPrev}
              >
                Previous
              </button>
              {pageItems.map((item, idx) =>
                item === 'ellipsis' ? (
                  <span
                    key={`e-${idx}`}
                    style={{
                      padding: '0 4px',
                      color: MUTED,
                      fontSize: '12px',
                      userSelect: 'none',
                    }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    aria-label={`Page ${item}`}
                    aria-current={item === currentPage ? 'page' : undefined}
                    style={pagerBtnStyle(item === currentPage, false)}
                    onClick={() => onPageChange?.(item)}
                  >
                    {item.toLocaleString()}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Next page"
                style={pagerBtnStyle(false, currentPage >= totalPages)}
                disabled={currentPage >= totalPages}
                onClick={goNext}
              >
                Next
              </button>
              <button
                type="button"
                aria-label="Last page"
                style={pagerBtnStyle(false, currentPage >= totalPages)}
                disabled={currentPage >= totalPages}
                onClick={goLast}
              >
                Last
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
