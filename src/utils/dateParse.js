/**
 * Reads a calendar YYYY-MM-DD from the start of an ISO / API date string.
 * Avoids `new Date('YYYY-MM-DD')` UTC parsing, which shifts the displayed day in many timezones.
 *
 * @param {string | null | undefined} dateStr
 * @returns {{ y: number, m: number, d: number } | null}
 */
export function parseCalendarYmd(dateStr) {
  if (dateStr == null || dateStr === '') return null
  const m = String(dateStr).trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null
  return { y, m: mo, d }
}
