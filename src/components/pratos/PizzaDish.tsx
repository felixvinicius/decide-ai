import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Pizza inteira com pepperoni e manjericão. */
export function PizzaDish({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <circle cx="60" cy="60" r="42" className="fill-sol-300" />
      <circle cx="60" cy="60" r="33" className="fill-caju-500" />
      <circle cx="46" cy="48" r="5" className="fill-sol-100" />
      <circle cx="74" cy="72" r="5" className="fill-sol-100" />
      <circle cx="48" cy="72" r="7" className="fill-caju-700" />
      <circle cx="74" cy="46" r="7" className="fill-caju-700" />
      <circle cx="60" cy="60" r="7" className="fill-caju-700" />
      <path d="M 34 40 c 6 -4 12 -3 14 3 c -6 3 -12 2 -14 -3 z" className="fill-mar-500" />
      <path d="M 70 84 c 6 -4 12 -3 14 3 c -6 3 -12 2 -14 -3 z" className="fill-mar-500" />
    </DishFrame>
  )
}
