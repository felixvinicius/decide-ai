import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Hambúrguer com queijo, alface e gergelim. */
export function Burger({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <rect x="30" y="84" width="60" height="14" rx="7" className="fill-sol-300" />
      <rect x="28" y="70" width="64" height="14" rx="7" className="fill-caju-800" />
      <rect x="28" y="62" width="64" height="10" rx="4" className="fill-sol-400" />
      <rect x="40" y="69" width="8" height="9" rx="3.5" className="fill-sol-400" />
      <rect x="70" y="69" width="8" height="9" rx="3.5" className="fill-sol-400" />
      <path
        d="M 26 62 c 4 -6 10 -2 14 -6 c 4 -4 10 0 14 -4 c 4 -4 10 0 14 -2 c 4 -2 10 2 14 4 c 3 2 4 5 4 6 c -22 3 -46 3 -60 2 z"
        className="fill-mar-300"
      />
      <path d="M 26 56 a 34 26 0 0 1 68 0 z" className="fill-sol-300" />
      <ellipse cx="46" cy="40" rx="4" ry="2.5" className="fill-sol-100" />
      <ellipse cx="62" cy="34" rx="4" ry="2.5" className="fill-sol-100" />
      <ellipse cx="76" cy="44" rx="4" ry="2.5" className="fill-sol-100" />
    </DishFrame>
  )
}
