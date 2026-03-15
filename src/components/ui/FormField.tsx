import type { InputHTMLAttributes } from 'react'

const inputClassName =
  'w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-[#242EDB]'
const labelClassName = 'mb-1 block text-sm font-medium text-gray-700'
const errorClassName = 'mt-1 text-sm text-red-600'

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  id: string
  label: string
  error?: string
  className?: string
}

export function FormField({ id, label, error, className, ...inputProps }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input id={id} className={className ?? inputClassName} {...inputProps} />
      {error && (
        <p className={errorClassName} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
