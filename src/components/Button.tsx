import { type ReactNode } from 'react'

interface ButtonProps {
  onClick: () => void
  children: ReactNode
  className?: string
  disabled?: boolean
}

export function Button({ onClick, children, className, disabled }: ButtonProps) {
  return (
    <button type="button" className={`btn-action${className ? ` ${className}` : ''}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
