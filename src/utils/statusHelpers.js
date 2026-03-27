/**
 * Numeric payment status codes from the API → display label and `Badge` variant.
 * @type {Record<number, { label: string, variant: 'success'|'warning'|'danger'|'info' }>}
 */
export const STATUS_MAP = {
    1: { label: 'Completed', variant: 'success' },
    2: { label: 'Pending',   variant: 'warning' },
    3: { label: 'Cancelled', variant: 'danger'  },
    0: { label: 'Unknown',   variant: 'info'    },
  }
  
  /**
   * Resolves a status code to its display config.
   * Falls back to 'Unknown' for any unmapped code.
   * @param {number} statusCode
   */
  export function getStatusConfig(statusCode) {
    return STATUS_MAP[statusCode] ?? STATUS_MAP[0]
  }