import { usePaymentDetail }  from '../../hooks/usePaymentDetail'
import { Modal }             from '../ui/Modal'
import { Spinner }           from '../ui/Spinner'
import { Badge }             from '../ui/Badge'
import { ErrorState }        from '../ui/ErrorState'
import { formatDate, formatCurrency } from '../../utils/formatters'
import { getStatusConfig }            from '../../utils/statusHelpers'
import {
  User, CreditCard, FileText, Hash, AlertCircle,
} from 'lucide-react'

/**
 * Fetches and displays one payment when `paymentId` is set; clears when the modal closes.
 *
 * @param {{
 *   paymentId: string | null,
 *   onClose: () => void,
 * }} props
 */
export function PaymentDetailModal({ paymentId, onClose }) {
  const { detail, isLoading, error, refetch } = usePaymentDetail(paymentId)

  return (
    <Modal
      isOpen={!!paymentId}
      onClose={onClose}
      title="Payment Details"
      size="xl"
    >
      {isLoading && (
        <div
          className="flex min-h-[min(340px,55vh)] flex-col items-center justify-center gap-5 px-4 py-10 text-center"
          role="status"
          aria-live="polite"
          aria-busy="true"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full
                       border border-brand-200 bg-brand-50"
          >
            <Spinner size="lg" label="Loading payment details" />
          </div>
          <p className="text-[17px] font-semibold text-neutral-800">
            Loading payment details
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-10 shadow-sm">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      )}

      {!isLoading && !error && detail && (
        <div
          className="flex flex-col gap-10 sm:gap-12"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <SummarySection detail={detail} />

          {detail.Payee && <PayeeSection payee={detail.Payee} />}

          {detail.ModeOfPayments?.length > 0 && (
            <ModeOfPaymentsSection modes={detail.ModeOfPayments} />
          )}

          {detail.invoices?.length > 0 && (
            <InvoicesSection invoices={detail.invoices} />
          )}

          {detail.Remarks && <RemarksSection remarks={detail.Remarks} />}
        </div>
      )}
    </Modal>
  )
}

function Section({ title, icon, children }) {
  const Icon = icon
  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-3 sm:mb-5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                     bg-brand-50 text-brand-700 ring-1 ring-brand-100/80"
        >
          <Icon size={18} strokeWidth={2} aria-hidden />
        </span>
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
          {title}
        </h3>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200/95 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04),0_4px_12px_rgb(15_23_42/0.04)]">
        <div className="px-6 py-3 sm:px-8 sm:py-4">{children}</div>
      </div>
    </div>
  )
}

function isDetailValueEmpty(value) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  return false
}

function DetailRow({ label, value, highlight = false }) {
  const content = isDetailValueEmpty(value) ? '—' : value
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-neutral-100 py-4 last:border-b-0 sm:grid-cols-[minmax(7rem,38%)_1fr] sm:items-start sm:gap-x-8 sm:py-5">
      <span className="text-sm font-medium text-neutral-600">{label}</span>
      <span
        className={`min-w-0 text-sm leading-relaxed break-words sm:text-right ${
          highlight ? 'font-semibold text-neutral-900' : 'text-neutral-800'
        }`}
      >
        {content}
      </span>
    </div>
  )
}

function SummarySection({ detail }) {
  const { label, variant } = getStatusConfig(detail.Status)

  return (
    <div className="min-w-0">
      <div
        className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b border-neutral-200/90
                   pb-8 sm:mb-10 sm:pb-10"
      >
        <div className="min-w-0 pr-2">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
            Payment number
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-brand-800 tabular-nums sm:text-4xl">
            {detail.PaymentNumber}
          </p>
        </div>
        <Badge variant={variant} className="mt-1 shrink-0 px-4 py-1.5 text-xs font-semibold">
          {label}
        </Badge>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-3 sm:gap-5">
        <AmountCard
          label="Amount paid"
          value={formatCurrency(detail.AmountPaid)}
          primary
        />
        <AmountCard
          label="Outstanding"
          value={formatCurrency(detail.Outstanding)}
          warn={detail.Outstanding > 0}
        />
        <AmountCard
          label="On account"
          value={formatCurrency(detail.onAccount)}
        />
      </div>

      <Section title="Payment info" icon={Hash}>
        <DetailRow label="Customer" value={detail.Customer} highlight />
        <DetailRow label="Payment date" value={formatDate(detail.PaymentDate)} />
        <DetailRow label="Created at" value={formatDate(detail.CreatedAt)} />
        <DetailRow label="Customer ID" value={detail.CustomerId} />
      </Section>
    </div>
  )
}

function AmountCard({ label, value, primary = false, warn = false }) {
  return (
    <div
      className={`rounded-xl border px-5 py-5 sm:px-6 sm:py-5 ${
        primary
          ? 'border-brand-200/90 bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100/70 ring-1 ring-brand-100/60 shadow-[inset_0_1px_0_rgb(255_255_255/0.85)]'
          : warn
            ? 'border-amber-200/90 bg-amber-50/90 ring-1 ring-amber-100/80'
            : 'border-neutral-200/95 bg-neutral-50/40 ring-1 ring-neutral-100/80'
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.08em] ${
          primary ? 'text-brand-700' : 'text-neutral-500'
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2.5 text-xl font-semibold tabular-nums tracking-tight sm:text-[1.35rem] ${
          primary ? 'text-brand-900' : warn ? 'text-amber-950' : 'text-neutral-900'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function PayeeSection({ payee }) {
  return (
    <Section title="Payee information" icon={User}>
      <DetailRow label="Full name" value={payee.FullName} highlight />
      <DetailRow
        label="Phone"
        value={
          payee.Phone ? (
            <a
              href={`tel:${payee.Phone}`}
              className="text-brand-700 font-medium hover:underline"
            >
              {payee.Phone}
            </a>
          ) : null
        }
      />
      <DetailRow
        label="Email"
        value={
          payee.Email ? (
            <a
              href={`mailto:${payee.Email}`}
              className="text-brand-700 font-medium hover:underline break-all"
            >
              {payee.Email}
            </a>
          ) : null
        }
      />
      <DetailRow label="Address" value={payee.Address} />
    </Section>
  )
}

function ModeOfPaymentsSection({ modes }) {
  return (
    <Section title="Mode of payment" icon={CreditCard}>
      {modes.map((mode, i) => (
        <div
          key={i}
          className="border-b border-neutral-100 pb-2 last:border-b-0 last:pb-0"
        >
          <div className="mb-1 flex items-center justify-between gap-4 rounded-lg border border-brand-100/80 bg-brand-50/90 px-4 py-3.5">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-brand-800">
              {mode.ModeOfPayment}
            </span>
            <span className="text-sm font-semibold tabular-nums text-neutral-900">
              {formatCurrency(mode.Amount)}
            </span>
          </div>
          <DetailRow label="Bank" value={mode.Bank} />
          <DetailRow label="Account" value={mode.Account} />
          <DetailRow label="Reference" value={mode.Reference} />
        </div>
      ))}
    </Section>
  )
}

function InvoicesSection({ invoices }) {
  return (
    <Section title="Linked invoices" icon={FileText}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-100/90">
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
              >
                Invoice #
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
              >
                Date
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
              >
                Total
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 pr-2 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
              >
                Outstanding
              </th>
              <th
                scope="col"
                className="whitespace-nowrap py-3 pl-6 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.Id}
                className="border-b border-neutral-100 last:border-0 hover:bg-brand-50/40 transition-colors"
              >
                <td className="max-w-[10rem] truncate px-4 py-3.5 font-semibold text-brand-800">
                  {inv.InvoiceNumber}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-neutral-600">
                  {formatDate(inv.InvoiceDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums font-medium text-neutral-900">
                  {formatCurrency(inv.TotalAmount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 pr-2 text-right tabular-nums text-neutral-600">
                  {formatCurrency(inv.Outstanding)}
                </td>
                <td className="whitespace-nowrap py-3.5 pl-6 pr-4">
                  <InvoiceStatusBadge status={inv.InvoiceStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

/** Maps API invoice status strings to `Badge` color variants. */
function InvoiceStatusBadge({ status }) {
  const map = {
    Paid:      'success',
    Partial:   'warning',
    Cancelled: 'danger',
    Overdue:   'danger',
    Unpaid:    'warning',
  }
  const variant = map[status] ?? 'info'
  return (
    <Badge variant={variant} className="whitespace-nowrap">
      {status ?? '—'}
    </Badge>
  )
}

function RemarksSection({ remarks }) {
  return (
    <Section title="Remarks" icon={AlertCircle}>
      <p className="py-4 text-sm leading-relaxed text-neutral-700 sm:py-5">
        {remarks}
      </p>
    </Section>
  )
}
