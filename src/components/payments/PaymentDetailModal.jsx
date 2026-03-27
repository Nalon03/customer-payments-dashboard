import { usePaymentDetail }  from '../../hooks/usePaymentDetail'
import { Modal }             from '../ui/Modal'
import { Spinner }           from '../ui/Spinner'
import { Badge }             from '../ui/Badge'
import { ErrorState }        from '../ui/ErrorState'
import { formatDate, formatCurrency } from '../../utils/formatters'
import { getStatusConfig }            from '../../utils/statusHelpers'
import {
  User, Phone, Mail,
  CreditCard, FileText, Hash,
  AlertCircle,
} from 'lucide-react'

/**
 * Full payment record in a modal; driven by row "View" actions.
 *
 * @param {{
 *   paymentId: string | null,
 *   onClose: () => void,
 * }} props
 */
export function PaymentDetailModal({ paymentId, onClose }) {
  const { detail, isLoading, error } = usePaymentDetail(paymentId)

  return (
    <Modal
      isOpen={!!paymentId}
      onClose={onClose}
      title="Payment Details"
      size="xl"
    >
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-neutral-400">Fetching payment record…</p>
        </div>
      )}

      {!isLoading && error && (
        <ErrorState message={error} />
      )}

      {!isLoading && !error && detail && (
        <div className="flex flex-col gap-6">

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

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className="text-brand-600" />
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function DetailRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5 border-b border-neutral-100 last:border-0">
      <span className="text-xs text-neutral-500 shrink-0 pt-0.5 w-36">
        {label}
      </span>
      <span className={`text-sm text-right break-words ${
        highlight ? 'font-semibold text-neutral-900' : 'text-neutral-700'
      }`}>
        {value ?? '—'}
      </span>
    </div>
  )
}

function SummarySection({ detail }) {
  const { label, variant } = getStatusConfig(detail.Status)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4
                      pb-4 border-b border-neutral-100">
        <div>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">
            Payment Number
          </p>
          <p className="text-2xl font-bold text-brand-700 mt-0.5">
            {detail.PaymentNumber}
          </p>
        </div>
        <Badge variant={variant} className="text-sm px-3 py-1">
          {label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <AmountCard
          label="Amount Paid"
          value={formatCurrency(detail.AmountPaid)}
          primary
        />
        <AmountCard
          label="Outstanding"
          value={formatCurrency(detail.Outstanding)}
          warn={detail.Outstanding > 0}
        />
        <AmountCard
          label="On Account"
          value={formatCurrency(detail.onAccount)}
        />
      </div>

      <Section title="Payment Info" icon={Hash}>
        <DetailRow label="Customer"     value={detail.Customer} highlight />
        <DetailRow label="Payment Date" value={formatDate(detail.PaymentDate)} />
        <DetailRow label="Created At"   value={formatDate(detail.CreatedAt)} />
        <DetailRow label="Customer ID"  value={detail.CustomerId} />
      </Section>
    </div>
  )
}

function AmountCard({ label, value, primary = false, warn = false }) {
  return (
    <div className={`rounded-lg px-4 py-3 border ${
      primary
        ? 'bg-brand-700 border-brand-700'
        : warn
          ? 'bg-warning-bg border-warning-bg'
          : 'bg-neutral-100 border-neutral-200'
    }`}>
      <p className={`text-xs font-medium mb-1 ${
        primary ? 'text-brand-200' : 'text-neutral-500'
      }`}>
        {label}
      </p>
      <p className={`text-base font-bold tabular-nums ${
        primary
          ? 'text-white'
          : warn
            ? 'text-warning-text'
            : 'text-neutral-800'
      }`}>
        {value}
      </p>
    </div>
  )
}

function PayeeSection({ payee }) {
  return (
    <Section title="Payee Information" icon={User}>
      <DetailRow label="Full Name" value={payee.FullName} highlight />
      <DetailRow
        label="Phone"
        value={
          payee.Phone
            ? <a href={`tel:${payee.Phone}`}
                 className="text-brand-600 hover:underline">
                {payee.Phone}
              </a>
            : null
        }
      />
      <DetailRow
        label="Email"
        value={
          payee.Email
            ? <a href={`mailto:${payee.Email}`}
                 className="text-brand-600 hover:underline">
                {payee.Email}
              </a>
            : null
        }
      />
      <DetailRow label="Address" value={payee.Address} />
    </Section>
  )
}

function ModeOfPaymentsSection({ modes }) {
  return (
    <Section title="Mode of Payment" icon={CreditCard}>
      {modes.map((mode, i) => (
        <div
          key={i}
          className="border-b border-neutral-100 last:border-0"
        >
          <div className="px-4 py-2 bg-brand-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-700">
              {mode.ModeOfPayment}
            </span>
            <span className="text-sm font-bold text-neutral-900 tabular-nums">
              {formatCurrency(mode.Amount)}
            </span>
          </div>
          <DetailRow label="Bank"      value={mode.Bank      || '—'} />
          <DetailRow label="Account"   value={mode.Account   || '—'} />
          <DetailRow label="Reference" value={mode.Reference || '—'} />
        </div>
      ))}
    </Section>
  )
}

function InvoicesSection({ invoices }) {
  return (
    <Section title="Linked Invoices" icon={FileText}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-100 text-xs text-neutral-500 uppercase tracking-wide">
              <th className="px-4 py-2 text-left font-semibold">Invoice #</th>
              <th className="px-4 py-2 text-left font-semibold">Date</th>
              <th className="px-4 py-2 text-right font-semibold">Total</th>
              <th className="px-4 py-2 text-right font-semibold">Outstanding</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {invoices.map((inv) => (
              <tr key={inv.Id} className="hover:bg-brand-50 transition-colors">
                <td className="px-4 py-2.5 font-medium text-brand-700">
                  {inv.InvoiceNumber}
                </td>
                <td className="px-4 py-2.5 text-neutral-600">
                  {formatDate(inv.InvoiceDate)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium text-neutral-900">
                  {formatCurrency(inv.TotalAmount)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-neutral-600">
                  {formatCurrency(inv.Outstanding)}
                </td>
                <td className="px-4 py-2.5">
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

/** Maps invoice status labels from the API to `Badge` colour variants. */
function InvoiceStatusBadge({ status }) {
  const map = {
    Paid:      'success',
    Partial:   'warning',
    Cancelled: 'danger',
    Overdue:   'danger',
  }
  const variant = map[status] ?? 'info'
  return <Badge variant={variant}>{status ?? '—'}</Badge>
}

function RemarksSection({ remarks }) {
  return (
    <Section title="Remarks" icon={AlertCircle}>
      <p className="px-4 py-3 text-sm text-neutral-600 leading-relaxed">
        {remarks}
      </p>
    </Section>
  )
}