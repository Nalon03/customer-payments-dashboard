// src/App.jsx
import { useState }           from 'react'
import { Layers }             from 'lucide-react'
import { usePayments }        from './hooks/usePayments'
import { FilterBar }          from './components/payments/FilterBar'
import { PaymentsTable }      from './components/payments/PaymentsTable'
import { PaymentDetailModal } from './components/payments/PaymentDetailModal'

export default function App() {
  const {
    payments, isLoading, error,
    sort, filters, totalCount,
    setSort, setFilters, applyDateRange, refetch,
  } = usePayments()

  const [selectedPaymentId, setSelectedPaymentId] = useState(null)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
      width: '100%',
    }}>

      {/* ── Header ── */}
      <header style={{
        backgroundColor: '#254F22',
        width: '100%',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}>

          {/* Left — brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            {/* Logo */}
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Layers size={16} color="white" strokeWidth={1.75} />
            </div>

            {/* Name */}
            <span style={{
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              PayView
            </span>

            {/* Divider */}
            <span style={{
              width: '1px',
              height: '18px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'block',
              flexShrink: 0,
            }} />

            {/* Subtitle */}
            <span style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '13px',
              fontWeight: 400,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              Payments Dashboard
            </span>
          </div>

        </div>
      </header>

      {/* ── Main ── */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '36px 32px',
        boxSizing: 'border-box',
      }}>

        {/* Page heading */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: '#0f172a',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.02em',
              }}>
                Payment Records
              </h1>
              <p style={{
                margin: '5px 0 0 0',
                fontSize: '13px',
                color: '#94a3b8',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>
                {isLoading
                  ? 'Loading…'
                  : `${payments.length} of ${totalCount} payment${totalCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
          <div style={{
            marginTop: '20px',
            height: '1px',
            backgroundColor: '#e2e8f0',
          }} />
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          isLoading={isLoading}
          onFiltersChange={setFilters}
          onApplyDateRange={applyDateRange}
        />

        {/* Table */}
        <PaymentsTable
          payments={payments}
          isLoading={isLoading}
          error={error}
          sort={sort}
          onSort={setSort}
          onView={setSelectedPaymentId}
          onRetry={refetch}
        />

      </main>

      <PaymentDetailModal
        paymentId={selectedPaymentId}
        onClose={() => setSelectedPaymentId(null)}
      />
    </div>
  )
}