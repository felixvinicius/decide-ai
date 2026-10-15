import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export type CardTone = 'default' | 'warning'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Espaçamento interno. Padrão: `md`. */
  padding?: CardPadding
  /** `default` (branco) ou `warning` (sol, para avisos). Padrão: `default`. */
  tone?: CardTone
  /** Dá sensação de clique (levanta a sombra no hover/foco). */
  interactive?: boolean
}

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

// A cor de borda e de fundo andam juntas para não brigar com o `bg-white`.
const toneClasses: Record<CardTone, string> = {
  default: 'border-sand-200 bg-white',
  warning: 'border-sand-500 bg-sol-100',
}

export function Card({
  padding = 'md',
  tone = 'default',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-3xl border shadow-soft',
        toneClasses[tone],
        paddingClasses[padding],
        interactive &&
          'transition-shadow duration-200 ease-out hover:shadow-lift focus-within:shadow-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
