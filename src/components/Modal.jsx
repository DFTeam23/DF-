import { useEffect, useRef } from 'react'
import { IconClose } from './icons'

/**
 * Accessible modal dialog: focus trap, Escape to close, click-outside to close,
 * and a labelled dialog role for screen readers.
 */
export default function Modal({ title, onClose, children, size = 'md', footer }) {
  const panelRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement
    const panel = panelRef.current
    // Focus the first focusable element inside the panel.
    const focusable = panel?.querySelector(
      'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
    )
    focusable?.focus()

    function onKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const nodes = panel.querySelectorAll(
        'input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"])',
      )
      const list = Array.from(nodes).filter((n) => !n.disabled && n.offsetParent !== null)
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused.current?.focus?.()
    }
  }, [onClose])

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-[8vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-scale-in w-full ${sizes[size]} rounded-2xl border border-ink-700/60 bg-ink-900 shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-ink-800 px-5 py-4">
          <h2 className="text-base font-semibold text-ink-50">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-ink-300 transition hover:bg-ink-800 hover:text-ink-50"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>
        <div className="df-scroll max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-ink-800 px-5 py-3">{footer}</div>
        )}
      </div>
    </div>
  )
}
