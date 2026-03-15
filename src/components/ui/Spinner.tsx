interface SpinnerProps {
  className?: string
  'aria-label'?: string
}

export function Spinner({
  className = 'h-8 w-8 animate-spin rounded-full border-2 border-[#242EDB] border-t-transparent',
  'aria-label': ariaLabel = 'Загрузка',
}: SpinnerProps) {
  return <div className={className} role="status" aria-label={ariaLabel} />
}
