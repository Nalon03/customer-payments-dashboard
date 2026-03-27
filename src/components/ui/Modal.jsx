import { useEffect, useRef, useCallback } from 'react'
import { createPortal }                   from 'react-dom'
import { X }                              from 'lucide-react'
import { clsx }                           from 'clsx'

const SIZE_CLASSES = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

/** CSS selector matching elements that participate in Tab order inside the dialog. */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Dialog rendered with `createPortal`. Locks body scroll, traps focus, closes on
 * Escape or overlay click, and sets `aria-modal` / `role="dialog"` for assistive tech.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title: string,
 *   children: React.ReactNode,
 *   size?: 'md' | 'lg' | 'xl',
 * }} props
 */
export function Modal({ isOpen, onClose, title, children, size = 'lg' }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Cycle Tab / Shift+Tab within the dialog so focus never lands on the obscured page.
  const trapFocus = useCallback((e) => {
    if (e.key !== 'Tab' || !contentRef.current) return

    const focusable = [...contentRef.current.querySelectorAll(FOCUSABLE)]
    if (focusable.length === 0) return

    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', trapFocus)
    return () => window.removeEventListener('keydown', trapFocus)
  }, [isOpen, trapFocus])

  useEffect(() => {
    if (!isOpen || !contentRef.current) return
    const first = contentRef.current.querySelector(FOCUSABLE)
    first?.focus()
  }, [isOpen])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-neutral-900/60 backdrop-blur-sm
                 animate-[fadeIn_0.15s_ease]"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={contentRef}
        className={clsx(
          'relative w-full bg-white rounded-xl shadow-modal',
          'max-h-[90vh] flex flex-col',
          'animate-[slideUp_0.2s_ease]',
          SIZE_CLASSES[size],
        )}
      >
        <div className="flex items-center justify-between px-6 py-4
                        border-b border-neutral-200 shrink-0">
          <h2
            id="modal-title"
            className="text-base font-semibold text-neutral-900"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-md text-neutral-400
                       hover:bg-neutral-100 hover:text-neutral-700
                       transition-colors focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}