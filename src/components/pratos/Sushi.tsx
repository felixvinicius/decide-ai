import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Temaki/nigiri com wasabi na travessa. */
export function Sushi({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <ellipse cx="58" cy="88" rx="42" ry="11" className="fill-cream" />
      <circle cx="40" cy="60" r="21" className="fill-mar-800" />
      <circle cx="40" cy="60" r="14" className="fill-cream" />
      <circle cx="40" cy="60" r="6" className="fill-caju-400" />
      <rect x="62" y="58" width="34" height="18" rx="9" className="fill-cream" />
      <rect x="60" y="44" width="38" height="16" rx="8" className="fill-caju-400" />
      <circle cx="94" cy="78" r="5.5" className="fill-mar-300" />
    </DishFrame>
  )
}
