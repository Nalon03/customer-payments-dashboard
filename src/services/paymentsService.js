import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/api'
import { MOCK_PAYMENTS, MOCK_PAYMENT_DETAILS } from '../constants/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * Fetches payments, optionally filtered by date range.
 * Mock mode applies the same StartDate/EndDate logic the real API uses.
 * @param {{ startDate?: string, endDate?: string }} params
 * @returns {Promise<Payment[]>}
 */
export async function fetchPayments({ startDate, endDate } = {}) {
  if (USE_MOCK) {
    let results = [...MOCK_PAYMENTS]

    // Compare calendar dates only; ignore time on PaymentDate.
    if (startDate) {
      const from = new Date(startDate)
      from.setHours(0, 0, 0, 0)
      results = results.filter((p) => new Date(p.PaymentDate) >= from)
    }

    if (endDate) {
      const to = new Date(endDate)
      to.setHours(23, 59, 59, 999) // inclusive end of selected day
      results = results.filter((p) => new Date(p.PaymentDate) <= to)
    }

    return simulateDelay(results)
  }

  try {
    const params = {}
    if (startDate) params.StartDate = startDate
    if (endDate)   params.EndDate   = endDate

    const { data } = await apiClient.get(ENDPOINTS.payments, { params })
    return data
  } catch {
    console.warn('Live API unavailable — using mock payment list.')
    return simulateDelay(MOCK_PAYMENTS)
  }
}

/**
 * Fetches the full detail record for a single payment.
 * @param {string} paymentId
 * @returns {Promise<PaymentDetail>}
 */
export async function fetchPaymentById(paymentId) {
  if (USE_MOCK) return simulateDelay(MOCK_PAYMENT_DETAILS[paymentId] ?? null)

  try {
    const { data } = await apiClient.get(ENDPOINTS.paymentDetail(paymentId))
    return data
  } catch {
    console.warn(`Live API unavailable — using mock detail for ${paymentId}.`)
    return simulateDelay(MOCK_PAYMENT_DETAILS[paymentId] ?? null)
  }
}

/**
 * Simulates realistic network latency for mock responses.
 * @param {*} data
 * @param {number} ms
 */
function simulateDelay(data, ms = 600) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}