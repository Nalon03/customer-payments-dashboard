import { SearchX } from 'lucide-react'

/**
 *
 * @param {{ title?: string, description?: string }} props
 */
export function EmptyState({
  title       = 'No matching payments',
  description = 'Try a different search or adjust your date filters.',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        width: '100%',
        maxWidth: '40rem',
        margin: '0 auto',
        padding: '32px 20px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <SearchX
        size={56}
        color="#94a3b8"
        strokeWidth={1.35}
        aria-hidden
        style={{
          display: 'block',
          flexShrink: 0,
          opacity: 0.88,
        }}
      />
      <p
        style={{
          margin: '24px 0 0',
          padding: 0,
          width: '100%',
          fontSize: '24px',
          fontWeight: 600,
          lineHeight: 1.3,
          color: '#0f172a',
          letterSpacing: '-0.025em',
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: '12px 0 0',
          padding: 0,
          width: '100%',
          maxWidth: '28rem',
          fontSize: '17px',
          fontWeight: 400,
          lineHeight: 1.55,
          color: '#64748b',
        }}
      >
        {description}
      </p>
    </div>
  )
}
