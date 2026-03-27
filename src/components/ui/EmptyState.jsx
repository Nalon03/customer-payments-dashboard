import { SearchX } from 'lucide-react'

const BRAND = '#254F22'
const BRAND_SOFT = '#e0f0dc'
const BRAND_RING = '#b8ddb2'
const BORDER = '#e2e8f0'
const PAGE_BG = '#f8fafc'
const TITLE = '#0f172a'
const BODY = '#64748b'

/**
 * Shown when the payments query returns no rows; styling matches surrounding cards.
 *
 * @param {{ title?: string, description?: string }} props
 */
export function EmptyState({
  title       = 'No payments found',
  description = 'Try changing your search or date range, then try again.',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: '20px 16px 28px',
        fontFamily: 'Inter, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          margin: '0 auto',
          padding: '36px 28px',
          backgroundColor: PAGE_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            backgroundColor: BRAND_SOFT,
            border: `1px solid ${BRAND_RING}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SearchX size={24} color={BRAND} strokeWidth={1.75} aria-hidden />
        </div>
        <p style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 600,
          color: TITLE,
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
        }}>
          {title}
        </p>
        <p style={{
          margin: '10px auto 0',
          fontSize: '13px',
          fontWeight: 400,
          color: BODY,
          lineHeight: 1.5,
          maxWidth: '300px',
        }}>
          {description}
        </p>
      </div>
    </div>
  )
}
