// All payment-related API calls live here.

import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/api'

/**
 * Fetches the full list of payments, optionally filtered by date range.
 * @param {{ startDate?: string, endDate?: string }} params
 * @returns {Promise<Payment[]>}
 */
export async function fetchPayments({ startDate, endDate } = {}) {
  const params = {}
  if (startDate) params.StartDate = startDate
  if (endDate)   params.EndDate   = endDate

  const { data } = await apiClient.get(ENDPOINTS.payments, { params })
  return data
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