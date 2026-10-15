import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

export type TagTone = 'neutral' | 'success' | 'muted'

export interface TagProps extends ComponentPropsWithoutRef<'span'> {
  /** `neutral` (padrão), `success` (verde-mar) ou `muted` (areia). */
  tone?: TagTone
}

const TONE_CLASSES: Record<TagTone, string> = {
  neutral: 'border-sand-500 bg-white text-ink',
  success: 'border-mar-500 bg-mar-50 text-mar-700',
  muted: 'border-sand-500 bg-sand-100 text-ink-soft',
}

/** Etiqueta pequena e NÃO interativa: categorias, faixa de preço, status. */
export function Tag({ tone = 'neutral', className, children, ...rest }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold',
        TONE_CLASSES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
