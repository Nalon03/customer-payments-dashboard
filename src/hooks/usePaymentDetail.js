import { useState, useEffect } from 'react'
import { fetchPaymentById } from '../services/paymentsService'

/**
 * Loads one payment detail by id. Pass `null` to clear state (e.g. modal closed).
 * Ignores stale responses if `paymentId` changes before the request finishes.
 *
 * @param {string|null} paymentId
 * @returns {{
 *   detail: object|null,
 *   isLoading: boolean,
 *   error: string|null,
 * }}
 */
export function usePaymentDetail(paymentId) {
  const [detail,    setDetail]    = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    if (!paymentId) {
      setDetail(null)
      setError(null)
      return
    }

    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      setDetail(null)

      try {
        const data = await fetchPaymentById(paymentId)

        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => { cancelled = true }
  }, [paymentId])

  return { detail, isLoading, error }
}