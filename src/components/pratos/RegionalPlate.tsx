import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Carne de sol com macaxeira na tábua. */
export function RegionalPlate({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <rect x="14" y="50" width="92" height="46" rx="12" className="fill-sand-400" />
      <rect x="24" y="58" width="46" height="14" rx="7" className="fill-caju-700" />
      <rect x="30" y="74" width="42" height="14" rx="7" className="fill-caju-800" />
      <rect x="76" y="56" width="22" height="13" rx="6.5" className="fill-sol-300" />
      <rect x="78" y="74" width="22" height="13" rx="6.5" className="fill-sol-400" />
      <path d="M 52 50 c 6 -10 16 -12 22 -8 c -8 3 -14 5 -22 8 z" className="fill-mar-500" />
    </DishFrame>
  )
}
