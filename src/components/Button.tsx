import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Peso visual do botão. Padrão: `primary`. */
  variant?: ButtonVariant
  /** `md` = 44px de altura (toque), `lg` = 52px. Padrão: `md`. */
  size?: ButtonSize
  /** Ocupa toda a largura do container. */
  fullWidth?: boolean
  /** Mostra o girador e bloqueia cliques enquanto carrega. */
  loading?: boolean
}

const baseClasses = clsx(
  'inline-flex items-center justify-center gap-2 rounded-full',
  'font-display text-base font-semibold leading-none select-none',
  'transition-[background-color,border-color,color,box-shadow] duration-150 ease-out',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caju-700',
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
)

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-caju-600 text-white shadow-soft hover:bg-caju-700 active:bg-caju-800',
  secondary: 'border-2 border-mar-500 bg-white text-mar-700 hover:bg-mar-50 active:bg-mar-100',
  ghost: 'bg-transparent text-caju-700 hover:bg-caju-50 active:bg-caju-100',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5',
  lg: 'min-h-13 px-7 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 aria-hidden="true" className="size-5 shrink-0 animate-spin" />}
      {children}
    </button>
  )
}
