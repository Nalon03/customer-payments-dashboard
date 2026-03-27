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

/** Normalises failed responses into `Error` with a safe `.message` for the UI. */
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