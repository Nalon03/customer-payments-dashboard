/**
 * Formats an ISO date string into a human-readable short date.
 * @param {string} dateStr - ISO 8601 date string
 * @returns {string} e.g. "24 Mar 2026"
 */
export function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('en-GB', {
      day:   '2-digit',
      month: 'short',
      year:  'numeric',
    }).format(new Date(dateStr))
  }
  
  /**
   * Formats a numeric amount as GHS currency.
   * @param {number} amount
   * @returns {string} e.g. "GHS 1,250.00"
   */
  export function formatCurrency(amount) {
    if (amount == null) return '—'
    return new Intl.NumberFormat('en-GH', {
      style:    'currency',
      currency: 'GHS',
    }).format(amount)
  }
  
  /**
   * Formats an ISO date string to YYYY-MM-DD for use in date input values.
   * @param {string} dateStr
   * @returns {string} e.g. "2026-03-24"
   */
  export function toInputDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toISOString().split('T')[0]
  }