import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import { buttonStyles } from './buttonStyles'
import type { ButtonSize, ButtonVariant } from './buttonStyles'

export interface LinkButtonProps extends ComponentPropsWithoutRef<'a'> {
  /** Mesmas variantes do `Button`. Padrão: `primary`. */
  variant?: ButtonVariant
  /** `md` = 44px de altura (toque), `lg` = 52px. Padrão: `md`. */
  size?: ButtonSize
  /** Ocupa toda a largura do container. */
  fullWidth?: boolean
}

/**
 * Link com a cara de botão, para navegação de verdade (`<a href>`), como abrir
 * o Google Maps. Em `target="_blank"` já garante o `rel` seguro.
 */
export function LinkButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  target,
  rel,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  const safeRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)

  return (
    <a
      target={target}
      rel={safeRel}
      className={clsx(buttonStyles({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {children}
    </a>
  )
}
