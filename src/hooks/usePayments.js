import { useState, useEffect, useMemo, useCallback } from 'react'
import { fetchPayments } from '../services/paymentsService'


const DEFAULT_SORT = { key: 'PaymentDate', direction: 'desc' }

/**
 * Fetches payments for the selected date range (server), then applies search and sort in memory.
 *
 * @returns {{
 *   payments: object[],
 *   isLoading: boolean,
 *   error: string|null,
 *   sort: { key: string, direction: 'asc'|'desc' },
 *   filters: { startDate: string, endDate: string, search: string },
 *   totalCount: number,
 *   setSort: function,
 *   setFilters: function,
 *   refetch: function,
 * }}
 */
export function usePayments() {
  const [rawPayments, setRawPayments] = useState([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [error,       setError]       = useState(null)

  const [filters, setFilters] = useState({
    startDate: '',
    endDate:   '',
    search:    '',
  })

  const [sort, setSort] = useState(DEFAULT_SORT)

  const loadPayments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchPayments({
        startDate: filters.startDate || undefined,
        endDate:   filters.endDate   || undefined,
      })
      setRawPayments(data ?? [])
    } catch (err) {
      setError(err.message)
      setRawPayments([])
    } finally {
      setIsLoading(false)
    }
  }, [filters.startDate, filters.endDate])


  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const payments = useMemo(() => {
    let result = [...rawPayments]

    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.Customer?.toLowerCase().includes(term) ||
          p.PaymentNumber?.toLowerCase().includes(term)
      )
    }

    result.sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]

      if (aVal == null) return 1
      if (bVal == null) return -1

      let comparison = 0

      if (typeof aVal === 'number') {
        comparison = aVal - bVal
      } else {
        comparison = String(aVal).localeCompare(String(bVal))
      }

      return sort.direction === 'asc' ? comparison : -comparison
    })

    return result
  }, [rawPayments, filters.search, sort])

  const handleSetSort = useCallback((key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    )
  }, [])

  const handleSetFilters = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
    payments,
    isLoading,
    error,
    sort,
    filters,
    totalCount: rawPayments.length,
    setSort: handleSetSort,
    setFilters: handleSetFilters,
    refetch: loadPayments,
  }
}