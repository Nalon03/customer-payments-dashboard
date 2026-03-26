// Central location for all API-related constants.

export const API_BASE_URL = 'https://spes.pscgh.com:442/sales-api/api'

export const ENDPOINTS = {
  payments: '/Payments',
  paymentDetail: (id) => `/Payments/${id}`,
}