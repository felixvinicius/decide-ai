import { Loader2 } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import { buttonStyles } from './buttonStyles'
import type { ButtonSize, ButtonVariant } from './buttonStyles'

export type { ButtonSize, ButtonStyleOptions, ButtonVariant } from './buttonStyles'

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
      className={clsx(buttonStyles({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {loading && <Loader2 aria-hidden="true" className="size-5 shrink-0 animate-spin" />}
      {children}
    </button>
  )
}
