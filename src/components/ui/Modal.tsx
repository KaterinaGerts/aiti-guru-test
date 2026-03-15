import type { ReactNode } from 'react'

interface ModalProps {
  /** ID for the title element (for aria-labelledby) */
  titleId: string
  title: string
  children: ReactNode
}

export function Modal({ titleId, title, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="mb-6 text-xl font-semibold text-gray-900">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
