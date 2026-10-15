import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Massa com almôndegas e manjericão no prato. */
export function Pasta({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <circle cx="60" cy="60" r="40" className="fill-cream" />
      <circle cx="60" cy="60" r="30" className="fill-sand-100" />
      <ellipse cx="60" cy="62" rx="24" ry="19" className="fill-sol-300" />
      <path d="M 42 56 c 8 -7 22 -7 30 2" strokeWidth={2.5} className="stroke-sol-500" />
      <path d="M 44 66 c 9 6 22 6 30 -1" strokeWidth={2.5} className="stroke-sol-500" />
      <path d="M 46 48 c 8 4 19 4 25 -2" strokeWidth={2.5} className="stroke-sol-500" />
      <circle cx="46" cy="50" r="9" className="fill-caju-700" />
      <circle cx="76" cy="74" r="9" className="fill-caju-700" />
      <path d="M 66 34 c 8 -2 12 2 12 8 c -8 0 -12 -4 -12 -8 z" className="fill-mar-500" />
    </DishFrame>
  )
}
