import { useState }           from 'react'
import { usePayments }        from './hooks/usePayments'
import { FilterBar }          from './components/payments/FilterBar'
import { PaymentsTable }      from './components/payments/PaymentsTable'
import { PaymentDetailModal } from './components/payments/PaymentDetailModal'
import { Layers }             from 'lucide-react'

export default function App() {
  const {
    payments, isLoading, error,
    sort, filters, totalCount,
    setSort, setFilters, refetch,
  } = usePayments()

  const [selectedPaymentId, setSelectedPaymentId] = useState(null)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8fafc' }}>

      <header
        role="banner"
        className="shrink-0 w-full"
        style={{ background: '#254F22' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Layers size={14} className="text-white" strokeWidth={1.75} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-semibold tracking-tight">
                PayView
              </span>
              <span
                className="text-white/40 text-xs hidden sm:inline"
                style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '8px' }}
              >
                Payments Dashboard
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-neutral-900 tracking-tight">
                Payment Records
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isLoading
                  ? 'Loading…'
                  : `${payments.length} of ${totalCount} payment${totalCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
          <div className="mt-4 h-px bg-neutral-200" />
        </div>

        <FilterBar
          filters={filters}
          isLoading={isLoading}
          onFiltersChange={setFilters}
        />

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