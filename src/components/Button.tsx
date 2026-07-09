import { type ReactNode } from 'react'

interface ButtonProps {
  onClick: () => void
  children: ReactNode
  className?: string
}

export function Button({ onClick, children, className }: ButtonProps) {
  return (
    <button type="button" className={`btn-action${className ? ` ${className}` : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
