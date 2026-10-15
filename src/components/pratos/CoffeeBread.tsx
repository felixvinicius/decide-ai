import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Café quentinho na caneca com pãozinho do lado. */
export function CoffeeBread({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <ellipse cx="30" cy="72" rx="16" ry="13" className="fill-sand-400" />
      <path d="M 22 66 l 8 8" strokeWidth={2.5} className="stroke-sand-500" />
      <path d="M 32 80 l 8 -8" strokeWidth={2.5} className="stroke-sand-500" />
      <ellipse cx="70" cy="92" rx="30" ry="8" className="fill-cream" />
      <rect x="46" y="62" width="46" height="28" rx="9" className="fill-cream" />
      <rect x="46" y="62" width="46" height="10" rx="5" className="fill-caju-800" />
      <path d="M 92 70 c 10 0 10 12 0 12" />
      <path d="M 60 52 c 0 -7 9 -7 9 -14" strokeWidth={3} />
      <path d="M 76 50 c 0 -7 9 -7 9 -14" strokeWidth={3} />
    </DishFrame>
  )
}
