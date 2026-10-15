import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Espaçamento interno. Padrão: `md`. */
  padding?: CardPadding
  /** Dá sensação de clique (levanta a sombra no hover/foco). */
  interactive?: boolean
}

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

export function Card({
  padding = 'md',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-sand-200 bg-white shadow-soft',
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
