/** Base URL and path templates for the payments API. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const ENDPOINTS = {
  payments: '/Payments',
  paymentDetail: (id) => `/Payments/${id}`,
}