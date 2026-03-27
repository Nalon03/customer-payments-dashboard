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

  return (
    <div style={{ marginBottom: '12px' }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        flexWrap: 'wrap',
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          minWidth: '200px',
          padding: '0 12px',
          height: '42px',
          borderRight: '1px solid #f1f5f9',
        }}>
          <Search size={14} color="#94a3b8" strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <input
            type="search"
            placeholder="Search payments…"
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: '#1e293b',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0 12px',
          height: '42px',
          flexWrap: 'wrap',
        }}>

          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#94a3b8',
            fontFamily: 'Inter, system-ui, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            From
          </span>

          <input
            type="date"
            value={filters.startDate}
            max={filters.endDate || undefined}
            disabled={isLoading}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            aria-label="Start date"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: filters.startDate ? '#254F22' : '#94a3b8',
              fontWeight: filters.startDate ? 500 : 400,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              opacity: isLoading ? 0.4 : 1,
            }}
          />

          <span style={{
            color: '#cbd5e1',
            fontSize: '13px',
            flexShrink: 0,
          }}>
            —
          </span>

          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#94a3b8',
            fontFamily: 'Inter, system-ui, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            To
          </span>

          <input
            type="date"
            value={filters.endDate}
            min={filters.startDate || undefined}
            disabled={isLoading}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            aria-label="End date"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: filters.endDate ? '#254F22' : '#94a3b8',
              fontWeight: filters.endDate ? 500 : 400,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              opacity: isLoading ? 0.4 : 1,
            }}
          />

          {hasAnyFilter && (
            <>
              <span style={{
                width: '1px',
                height: '18px',
                backgroundColor: '#f1f5f9',
                flexShrink: 0,
                margin: '0 4px',
              }} />
              <button
                onClick={handleClearAll}
                aria-label="Clear all filters"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#94a3b8',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  padding: '4px 0',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#475569'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <X size={11} strokeWidth={2} />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {(filters.startDate || filters.endDate) && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px',
          marginTop: '6px',
          paddingLeft: '0',
        }}>
          {filters.startDate && (
            <Chip
              label={`From: ${filters.startDate}`}
              onRemove={() => handleDateChange('startDate', '')}
            />
          )}
          {filters.endDate && (
            <Chip
              label={`To: ${filters.endDate}`}
              onRemove={() => handleDateChange('endDate', '')}
            />
          )}
        </div>
      )}
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      height: '22px',
      padding: '0 8px',
      borderRadius: '99px',
      backgroundColor: '#e0f0dc',
      border: '1px solid #b8ddb2',
      fontSize: '11px',
      fontWeight: 500,
      color: '#254F22',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          color: '#5a9e50',
          marginLeft: '2px',
        }}
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </span>
  )
}