import { useState, useEffect, useLayoutEffect, useMemo, useCallback } from 'react'
import {
  fetchPayments,
  SERVER_CHUNK_SIZE,
  ROWS_PER_PAGE_OPTIONS,
} from '../services/paymentsService'

const DEFAULT_SORT = { key: 'PaymentDate', direction: 'desc' }

/**
 * Lists payments with server-side filters and a fixed 500-row chunk; the UI pages within
 * the loaded chunk and refetches when the chunk index changes.
 *
 * @returns {object} Payments list state: `payments`, `isLoading`, `error`, `sort`, `filters`, `totalCount`,
 *   `pagination`, and setters plus `refetch` / `applyDateRange`.
 */
export function usePayments() {
  const [rawPayments, setRawPayments] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [serverTotalPages, setServerTotalPages] = useState(1)
  const [serverPageSize, setServerPageSize] = useState(SERVER_CHUNK_SIZE)

  const [uiPage, setUiPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    search: '',
  })

  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState(DEFAULT_SORT)

  const startIndex = (uiPage - 1) * rowsPerPage
  const serverPageNum = Math.floor(startIndex / SERVER_CHUNK_SIZE) + 1
  const offsetInChunk = startIndex % SERVER_CHUNK_SIZE

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search.trim())
    }, 400)
    return () => clearTimeout(t)
  }, [filters.search])

  useLayoutEffect(() => {
    setUiPage(1)
  }, [filters.startDate, filters.endDate, debouncedSearch])

  useLayoutEffect(() => {
    setUiPage(1)
  }, [rowsPerPage])

  const loadPayments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { payments, pagination: meta } = await fetchPayments({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        pageNumber: serverPageNum,
        pageSize: SERVER_CHUNK_SIZE,
        searchQuery: debouncedSearch || undefined,
      })
      setRawPayments(payments)
      const tc = meta.totalCount ?? payments.length
      const stp = meta.totalPages ?? 0
      setTotalCount(tc)
      setServerPageSize(meta.pageSize ?? SERVER_CHUNK_SIZE)
      setServerTotalPages(stp > 0 ? stp : 1)
    } catch (err) {
      setError(err.message)
      setRawPayments([])
      setTotalCount(0)
      setServerTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [
    serverPageNum,
    filters.startDate,
    filters.endDate,
    debouncedSearch,
  ])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const uiTotalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage) || 1)

  useEffect(() => {
    if (uiPage > uiTotalPages) setUiPage(uiTotalPages)
  }, [uiPage, uiTotalPages])

  const payments = useMemo(() => {
    let chunk = [...rawPayments]

    chunk.sort((a, b) => {
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

    return chunk.slice(offsetInChunk, offsetInChunk + rowsPerPage)
  }, [rawPayments, offsetInChunk, rowsPerPage, sort])

  const pagination = useMemo(
    () => ({
      totalCount,
      serverPageSize,
      serverTotalPages,
      serverPageNum,
      rowsPerPage,
      currentPage: uiPage,
      totalPages: uiTotalPages,
      rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
    }),
    [
      totalCount,
      serverPageSize,
      serverTotalPages,
      serverPageNum,
      rowsPerPage,
      uiPage,
      uiTotalPages,
    ],
  )

  const handleSetSort = useCallback((key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }, [])

  const handleSetFilters = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }, [])

  const applyDateRange = useCallback(() => {
    setUiPage(1)
  }, [])

  const setRowsPerPageSafe = useCallback((n) => {
    const v = Number(n)
    if (ROWS_PER_PAGE_OPTIONS.includes(v)) setRowsPerPage(v)
  }, [])

  return {
    payments,
    isLoading,
    error,
    sort,
    filters,
    totalCount,
    pagination,
    setPage: setUiPage,
    setRowsPerPage: setRowsPerPageSafe,
    setSort: handleSetSort,
    setFilters: handleSetFilters,
    applyDateRange,
    refetch: loadPayments,
  }
}
