import clsx from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

export interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const BASE_CLASSES = clsx(
  'inline-flex items-center justify-center gap-2 rounded-full',
  'font-display text-base font-semibold leading-none select-none',
  'transition-[background-color,border-color,color,box-shadow] duration-150 ease-out',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caju-700',
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
)

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-caju-600 text-white shadow-soft hover:bg-caju-700 active:bg-caju-800',
  secondary: 'border-2 border-mar-500 bg-white text-mar-700 hover:bg-mar-50 active:bg-mar-100',
  ghost: 'bg-transparent text-caju-700 hover:bg-caju-50 active:bg-caju-100',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5',
  lg: 'min-h-13 px-7 text-lg',
}

/** Visual compartilhado entre `Button` (<button>) e `LinkButton` (<a>). */
export function buttonStyles(options: ButtonStyleOptions = {}): string {
  const { variant = 'primary', size = 'md', fullWidth = false } = options
  return clsx(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], fullWidth && 'w-full')
}
