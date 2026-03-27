import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/api'

/** Inclusive local calendar bounds so same-day payments are not dropped at API boundaries. */
function toApiStartDate(ymd) {
  return `${ymd}T00:00:00.000`
}

function toApiEndDate(ymd) {
  return `${ymd}T23:59:59.999`
}

/**
 * Live API returns up to this many rows per request (smaller `PageSize` is ignored).
 * UI pagination uses smaller `rowsPerPage` and only refetches when this chunk changes.
 */
export const SERVER_CHUNK_SIZE = 500

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50]

/**
 * @param {string | undefined} raw
 * @returns {{
 *   totalCount?: number,
 *   pageSize?: number,
 *   currentPage?: number,
 *   totalPages?: number,
 *   previousPageLink?: string | null,
 *   nextPageLink?: string | null,
 * } | null}
 */
export function parsePaginationHeader(raw) {
  if (raw == null || raw === '') return null
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : null
  } catch {
    return null
  }
}

/**
 * Fetches one server chunk of payments.
 * Reads metadata from the `X-Pagination` response header when present.
 *
 * @param {{
 *   startDate?: string,
 *   endDate?: string,
 *   pageNumber?: number,
 *   pageSize?: number,
 *   searchQuery?: string,
 * }} params
 * @returns {Promise<{ payments: Payment[], pagination: object }>}
 */
export async function fetchPayments({
  startDate,
  endDate,
  pageNumber = 1,
  pageSize = SERVER_CHUNK_SIZE,
  searchQuery,
} = {}) {
  const params = {
    PageNumber: pageNumber,
    PageSize: pageSize,
  }
  if (startDate) params.StartDate = toApiStartDate(startDate)
  if (endDate) params.EndDate = toApiEndDate(endDate)
  if (searchQuery) params.SearchQuery = searchQuery

  const response = await apiClient.get(ENDPOINTS.payments, { params })
  const payments = Array.isArray(response.data) ? response.data : []

  const headerVal =
    response.headers?.['x-pagination'] ??
    response.headers?.['X-Pagination']

  const meta = parsePaginationHeader(headerVal)
  const pagination = meta ?? {
    totalCount: payments.length,
    pageSize,
    currentPage: pageNumber,
    totalPages: payments.length > 0 ? 1 : 0,
  }

  return { payments, pagination }
}

/**
 * Fetches the full detail record for a single payment.
 * @param {string} paymentId
 * @returns {Promise<PaymentDetail>}
 */
export async function fetchPaymentById(paymentId) {
  const { data } = await apiClient.get(ENDPOINTS.paymentDetail(paymentId))
  return data
}
