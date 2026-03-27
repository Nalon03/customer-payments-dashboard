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

  // Focus trap: keep Tab / Shift+Tab inside the dialog so focus cannot move to the page behind the overlay.
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
          'relative w-full bg-white rounded-2xl',
          'shadow-[var(--shadow-modal),0_0_0_1px_rgb(15_23_42/0.06)]',
          'max-h-[90vh] flex flex-col',
          'animate-[slideUp_0.2s_ease]',
          SIZE_CLASSES[size],
        )}
      >
        <div
          className="flex min-h-[3.75rem] shrink-0 items-center justify-between gap-6 border-b border-neutral-200/90 bg-white px-6 pt-5 pb-4 sm:px-8 sm:pt-6 sm:pb-5 md:px-10 md:pt-7 md:pb-6"
        >
          <h2
            id="modal-title"
            className="pr-2 text-xl font-semibold leading-snug text-neutral-900 tracking-tight"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                       border border-neutral-200 bg-white text-neutral-600
                       hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100
                       transition-colors focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-neutral-50/50 px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-12 lg:py-10">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}