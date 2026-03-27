import { Search, X } from 'lucide-react'

export function FilterBar({ filters, isLoading, onFiltersChange, onApplyDateRange }) {

  function handleDateChange(field, value) {
    onFiltersChange({ [field]: value })
    onApplyDateRange()
  }

  function handleClearAll() {
    onFiltersChange({ startDate: '', endDate: '', search: '' })
    onApplyDateRange()
  }

  const hasAnyFilter = filters.startDate || filters.endDate || filters.search

  /** Separate surfaces per control (Fluent-style: distinct cards, 8px grid gap, neutral stroke). */
  const filterSurface = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
    minHeight: '44px',
    padding: '0 12px',
    boxSizing: 'border-box',
  }

  const fieldLabel = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748b',
    fontFamily: 'Inter, system-ui, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    flexShrink: 0,
  }

  const dateInputStyle = (hasValue) => ({
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '13px',
    color: hasValue ? '#254F22' : '#94a3b8',
    fontWeight: hasValue ? 500 : 400,
    fontFamily: 'Inter, system-ui, sans-serif',
    cursor: 'pointer',
    opacity: isLoading ? 0.4 : 1,
    minWidth: 0,
  })

  return (
    <div style={{ marginBottom: '24px' }}>

      <div
        role="toolbar"
        aria-label="Filter payments"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >

        <div style={{ ...filterSurface, flex: '1 1 220px' }}>
          <Search size={14} color="#94a3b8" strokeWidth={1.75} style={{ flexShrink: 0 }} aria-hidden />
          <input
            type="search"
            placeholder="Search payments…"
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            aria-label="Search payments"
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: '#1e293b',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          />
        </div>

        <div style={{ ...filterSurface, flex: '0 1 auto' }}>
          <span style={fieldLabel}>From</span>
          <input
            type="date"
            value={filters.startDate}
            max={filters.endDate || undefined}
            disabled={isLoading}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            aria-label="Start date"
            style={dateInputStyle(!!filters.startDate)}
          />
        </div>

        <div style={{ ...filterSurface, flex: '0 1 auto' }}>
          <span style={fieldLabel}>To</span>
          <input
            type="date"
            value={filters.endDate}
            min={filters.startDate || undefined}
            disabled={isLoading}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            aria-label="End date"
            style={dateInputStyle(!!filters.endDate)}
          />
        </div>

        {hasAnyFilter && (
          <div style={{ ...filterSurface, flex: '0 0 auto', gap: '8px' }}>
            <button
              type="button"
              onClick={handleClearAll}
              aria-label="Clear all filters"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: '#475569',
                fontFamily: 'Inter, system-ui, sans-serif',
                padding: '4px 0',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#254F22' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569' }}
            >
              <X size={14} strokeWidth={2} aria-hidden />
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  )
}