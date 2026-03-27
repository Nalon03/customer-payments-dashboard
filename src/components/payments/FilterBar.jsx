import { Search, X } from 'lucide-react'
import { clsx }      from 'clsx'

export function FilterBar({ filters, isLoading, onFiltersChange }) {

  function handleDateChange(field, value) {
    onFiltersChange({ [field]: value })
  }

  function handleClearAll() {
    onFiltersChange({ startDate: '', endDate: '', search: '' })
  }

  const hasAnyFilter = filters.startDate || filters.endDate || filters.search

  return (
    <div className="mb-4">
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-0
                   bg-white border border-neutral-200 rounded-xl overflow-hidden"
        style={{ boxShadow: '0 1px 2px rgb(0 0 0 / 0.04)' }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0 px-4 py-3">
          <Search size={14} className="text-neutral-400 shrink-0" strokeWidth={1.75} />
          <input
            type="search"
            placeholder="Search payments…"
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="flex-1 min-w-0 text-sm bg-transparent border-0
                       outline-none text-neutral-800 placeholder:text-neutral-400"
          />
        </div>

        <div className="hidden sm:block w-px self-stretch bg-neutral-100" />

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">
              From
            </span>
            <input
              type="date"
              value={filters.startDate}
              max={filters.endDate || undefined}
              disabled={isLoading}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              aria-label="Start date"
              className={clsx(
                'text-sm bg-transparent border-0 outline-none cursor-pointer',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                filters.startDate
                  ? 'text-brand-700 font-medium'
                  : 'text-neutral-400',
              )}
            />
          </div>

          <span className="text-neutral-200 text-sm">|</span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">
              To
            </span>
            <input
              type="date"
              value={filters.endDate}
              min={filters.startDate || undefined}
              disabled={isLoading}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              aria-label="End date"
              className={clsx(
                'text-sm bg-transparent border-0 outline-none cursor-pointer',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                filters.endDate
                  ? 'text-brand-700 font-medium'
                  : 'text-neutral-400',
              )}
            />
          </div>

          {hasAnyFilter && (
            <>
              <div className="w-px self-stretch bg-neutral-100" />
              <button
                onClick={handleClearAll}
                aria-label="Clear all filters"
                className="flex items-center gap-1 text-xs text-neutral-400
                           hover:text-neutral-600 transition-colors focus:outline-none
                           whitespace-nowrap"
              >
                <X size={11} strokeWidth={2} />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {hasAnyFilter && (
        <div className="mt-2 flex flex-wrap gap-1.5 px-0.5">
          {filters.search && (
            <Chip
              label={`"${filters.search}"`}
              onRemove={() => onFiltersChange({ search: '' })}
            />
          )}
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
    <span
      className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full
                 text-xs font-medium text-brand-700"
      style={{
        background: '#e0f0dc',
        border: '1px solid #b8ddb2',
      }}
    >
      {label}
      <button
        onClick={onRemove}
        className="text-brand-400 hover:text-brand-700 focus:outline-none ml-0.5"
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </span>
  )
}