import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Picanha na brasa, com a capa de gordura e a fumaça subindo. */
export function Barbecue({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <ellipse cx="60" cy="92" rx="42" ry="11" className="fill-cream" />
      <rect x="24" y="52" width="72" height="16" rx="8" className="fill-sol-300" />
      <rect x="24" y="62" width="72" height="32" rx="10" className="fill-caju-800" />
      <path d="M 36 72 h 14" strokeWidth={3} className="stroke-sol-300" />
      <path d="M 62 72 h 14" strokeWidth={3} className="stroke-sol-300" />
      <path d="M 36 84 h 14" strokeWidth={3} className="stroke-sol-300" />
      <path d="M 62 84 h 14" strokeWidth={3} className="stroke-sol-300" />
      <path d="M 44 40 c 0 -8 10 -8 10 -16" strokeWidth={3} />
      <path d="M 68 36 c 0 -8 10 -8 10 -16" strokeWidth={3} />
    </DishFrame>
  )
}
