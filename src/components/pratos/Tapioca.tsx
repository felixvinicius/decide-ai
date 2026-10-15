import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Tapioca dobrada com recheio, no prato. */
export function Tapioca({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <ellipse cx="60" cy="92" rx="42" ry="11" className="fill-cream" />
      <path d="M 24 74 a 36 36 0 0 1 72 0 z" className="fill-cream" />
      <path d="M 36 66 a 24 24 0 0 1 48 0 z" className="fill-sol-400" />
      <circle cx="48" cy="62" r="4.5" className="fill-caju-500" />
      <circle cx="70" cy="60" r="4" className="fill-mar-400" />
    </DishFrame>
  )
}
