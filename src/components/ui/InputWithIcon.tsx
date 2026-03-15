import type { InputHTMLAttributes, ReactNode } from 'react'

const wrapperClassName =
  'flex h-12 items-center gap-3 rounded-xl border border-[#EDEDED] bg-white px-4 py-3.5'
const inputClassName =
  'min-w-0 flex-1 bg-transparent text-lg text-[#232323] outline-none placeholder:text-gray-400 disabled:opacity-60'
const labelClassName = 'text-lg font-medium text-[#232323]'
const errorClassName = 'text-sm text-red-600'

interface InputWithIconProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  id: string
  label: string
  leftIcon: ReactNode
  trailing?: ReactNode
  error?: string
}

export function InputWithIcon({
  id,
  label,
  leftIcon,
  trailing,
  error,
  ...inputProps
}: InputWithIconProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className={wrapperClassName}>
        {leftIcon}
        <input id={id} className={inputClassName} {...inputProps} />
        {trailing}
      </div>
      {error && (
        <p className={errorClassName} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
