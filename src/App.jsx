import { useState }           from 'react'
import { Layers }             from 'lucide-react'
import { usePayments }        from './hooks/usePayments'
import { FilterBar }          from './components/payments/FilterBar'
import { PaymentsTable }      from './components/payments/PaymentsTable'
import { PaymentDetailModal } from './components/payments/PaymentDetailModal'

export default function App() {
  const {
    payments, isLoading, error,
    sort, filters, totalCount, pagination,
    setPage, setRowsPerPage,
    setSort, setFilters, applyDateRange, refetch,
  } = usePayments()

  const [selectedPaymentId, setSelectedPaymentId] = useState(null)

  return (
    <div style={{
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
      width: '100%',
      overflow: 'hidden',
    }}>

      <header style={{
        backgroundColor: '#254F22',
        width: '100%',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            <div
              aria-hidden
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '7px',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Layers size={16} color="white" strokeWidth={1.75} />
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: 'white',
                letterSpacing: '-0.01em',
              }}
            >
              Customer Payments Records
            </h1>
          </div>

        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 24px 28px',
        boxSizing: 'border-box',
      }}>

        <div style={{ marginBottom: '28px', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            gap: '12px 16px',
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: '#0f172a',
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em',
              alignSelf: 'center',
            }}>
              Payment Records
            </h2>
            <div
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                padding: '8px 14px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '12px',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              <span style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}>
                Total payments:
              </span>
              <span style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                color: '#1a3a18',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                {isLoading ? '—' : totalCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div style={{ flexShrink: 0 }}>
          <FilterBar
            filters={filters}
            isLoading={isLoading}
            onFiltersChange={setFilters}
            onApplyDateRange={applyDateRange}
          />
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <PaymentsTable
            payments={payments}
            isLoading={isLoading}
            error={error}
            sort={sort}
            onSort={setSort}
            onView={setSelectedPaymentId}
            onRetry={refetch}
            pagination={pagination}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </div>

      </main>

      <PaymentDetailModal
        paymentId={selectedPaymentId}
        onClose={() => setSelectedPaymentId(null)}
      />
    </div>
  )
}