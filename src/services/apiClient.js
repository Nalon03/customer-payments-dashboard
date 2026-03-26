// All requests go through here, ensuring consistent base URL,
// timeout, and error handling in one place.

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


/**Response Interceptor **/

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      'An unexpected error occurred.'

    return Promise.reject(new Error(message))
  }
)

export default apiClient