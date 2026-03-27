import axios from 'axios'
import { API_BASE_URL } from '../constants/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Turns HTTP/network failures into short, user-facing messages; uses the server body when it includes a message or title.
 */
function userFacingErrorMessage(error) {
  const status = error.response?.status
  const data = error.response?.data
  const serverMessage =
    (typeof data?.message === 'string' && data.message.trim()) ||
    (typeof data?.title === 'string' && data.title.trim()) ||
    null

  if (error.code === 'ECONNABORTED' || /timeout/i.test(error.message ?? '')) {
    return 'This is taking longer than expected. Check your connection and try again.'
  }

  if (!error.response) {
    return "We can't reach the server right now. Check your internet connection and try again."
  }

  if (serverMessage) {
    return serverMessage
  }

  if (status === 404) {
    return "We couldn't find that information. It may have been removed or is no longer available."
  }

  if (status === 401 || status === 403) {
    return "You don't have permission to view this content."
  }

  if (status >= 502 && status <= 504) {
    return 'The service is temporarily unavailable. Please try again in a few minutes.'
  }

  if (status >= 500) {
    return 'Something went wrong on our end. Please try again later.'
  }

  return error.message || 'Something went wrong. Please try again.'
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(userFacingErrorMessage(error)))
)

export default apiClient
