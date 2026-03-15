import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'flex-1 rounded-xl bg-[#242EDB] py-2.5 font-medium text-white hover:opacity-95',
  secondary:
    'flex-1 rounded-xl border border-gray-300 bg-white py-2.5 font-medium text-gray-700 hover:bg-gray-50',
  ghost: 'rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button className={className ?? variantClasses[variant]} {...props}>
      {children}
    </button>
  )
}
