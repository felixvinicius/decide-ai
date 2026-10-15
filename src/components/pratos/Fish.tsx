import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Peixe/peixada na travessa. */
export function Fish({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <ellipse cx="60" cy="90" rx="42" ry="11" className="fill-cream" />
      <path d="M 30 60 L 12 46 v 28 z" className="fill-mar-300" />
      <ellipse cx="58" cy="60" rx="32" ry="19" className="fill-mar-300" />
      <path d="M 44 44 L 54 26 L 66 44 z" className="fill-mar-400" />
      <path d="M 50 78 L 58 92 L 66 78 z" className="fill-mar-400" />
      <circle cx="78" cy="54" r="3" className="fill-ink" />
      <path d="M 68 48 c -4 8 -4 16 0 24" strokeWidth={3} />
      <path d="M 42 52 c 4 4 8 4 12 0" strokeWidth={2.5} />
      <path d="M 38 66 c 4 4 8 4 12 0" strokeWidth={2.5} />
    </DishFrame>
  )
}
