import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

export interface ChipProps extends ComponentPropsWithoutRef<'button'> {
  /** Marcado ou não. O chip é pensado para seleção múltipla. */
  selected?: boolean
}

export function Chip({ selected = false, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={clsx(
        'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4',
        'font-sans text-base font-semibold transition-colors duration-150 ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caju-700',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'border-caju-600 bg-caju-600 text-white shadow-soft'
          : 'border-sand-500 bg-white text-ink hover:border-caju-500 hover:bg-caju-50 active:bg-caju-100',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
