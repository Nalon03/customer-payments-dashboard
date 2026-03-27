import { parseCalendarYmd } from './dateParse'

/**
  */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const cal = parseCalendarYmd(dateStr)
  if (cal) {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(cal.y, cal.m - 1, cal.d))
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

/**
 * Formats a numeric amount as GHS currency.
 */
export function formatCurrency(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount)
}

/**
 */
export function toInputDate(dateStr) {
  const cal = parseCalendarYmd(dateStr)
  if (cal) {
    const mm = String(cal.m).padStart(2, '0')
    const dd = String(cal.d).padStart(2, '0')
    return `${cal.y}-${mm}-${dd}`
  }
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toISOString().split('T')[0]
  } catch {
    return ''
  }
}
