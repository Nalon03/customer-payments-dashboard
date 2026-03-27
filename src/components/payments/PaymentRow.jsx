import { useState }       from 'react'
import { Eye }            from 'lucide-react'
import { Badge }          from '../ui/Badge'
import { formatDate, formatCurrency } from '../../utils/formatters'
import { getStatusConfig }            from '../../utils/statusHelpers'

export function PaymentRow({ payment, onView, index }) {
  const { label, variant } = getStatusConfig(payment.Status)
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid #f1f5f9',
        backgroundColor: hovered ? '#fafafa' : (index % 2 === 0 ? 'white' : '#fdfefe'),
        transition: 'background-color 0.1s',
      }}
    >
      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
        <span style={{
          fontSize: '12px',
          fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
          fontWeight: 500,
          color: '#254F22',
          letterSpacing: '-0.01em',
        }}>
          {payment.PaymentNumber ?? '—'}
        </span>
      </td>

      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#e0f0dc',
            color: '#254F22',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontFamily: 'Inter, system-ui, sans-serif',
            userSelect: 'none',
          }}>
            {payment.Customer?.[0]?.toUpperCase() ?? '?'}
          </span>
          <span style={{
            fontSize: '13px',
            color: '#1e293b',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {payment.Customer ?? '—'}
          </span>
        </div>
      </td>

      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatCurrency(payment.Amount)}
        </span>
      </td>

      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
        <span style={{
          fontSize: '13px',
          color: '#64748b',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatDate(payment.PaymentDate)}
        </span>
      </td>

      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
        {payment.Status != null
          ? <Badge variant={variant}>{label}</Badge>
          : <span style={{ color: '#e2e8f0' }}>—</span>
        }
      </td>

      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', textAlign: 'right' }}>
        <button
          onClick={() => onView(payment.PaymentId)}
          aria-label={`View details for ${payment.PaymentNumber}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#254F22',
            backgroundColor: '#f4faf3',
            border: '1px solid #b8ddb2',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0f0dc'
            e.currentTarget.style.borderColor = '#85c27a'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f4faf3'
            e.currentTarget.style.borderColor = '#b8ddb2'
          }}
        >
          <Eye size={12} strokeWidth={1.75} />
          View
        </button>
      </td>
    </tr>
  )
}