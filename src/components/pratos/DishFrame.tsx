import clsx from 'clsx'
import type { ReactNode } from 'react'

/** Props comuns de todas as ilustrações de prato. */
export interface DishProps {
  className?: string
  /** Rótulo acessível. Sem ele, a ilustração é tratada como decorativa. */
  title?: string
}

export interface DishFrameProps extends DishProps {
  children: ReactNode
}

/**
 * Moldura única das ilustrações: mesmo enquadramento (120x120), contorno grosso
 * na cor `ink` do tema e traços arredondados. Os filhos só escolhem as cores.
 */
export function DishFrame({ title, className, children }: DishFrameProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={clsx('stroke-ink', className)}
      fill="none"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}
