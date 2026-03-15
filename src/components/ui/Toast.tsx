import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useToastStore } from '../../stores/toastStore'

const TOAST_DURATION_MS = 3000

export function Toast() {
  const message = useToastStore((s) => s.message)
  const hide = useToastStore((s) => s.hide)

  useEffect(() => {
    if (!message) return
    const id = window.setTimeout(hide, TOAST_DURATION_MS)
    return () => window.clearTimeout(id)
  }, [message, hide])

  if (!message) return null

  return createPortal(
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-6 py-3 text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>,
    document.body,
  )
}
