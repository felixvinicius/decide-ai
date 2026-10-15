import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Camarão/lagosta servido no prato. */
export function Crustacean({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <ellipse cx="60" cy="88" rx="42" ry="12" className="fill-cream" />
      <path d="M 32 62 L 14 50 v 24 z" className="fill-caju-400" />
      <rect x="30" y="46" width="54" height="32" rx="16" className="fill-caju-400" />
      <path d="M 52 48 v 28" strokeWidth={2.5} className="stroke-caju-700" />
      <path d="M 66 48 v 28" strokeWidth={2.5} className="stroke-caju-700" />
      <circle cx="88" cy="62" r="14" className="fill-caju-500" />
      <circle cx="90" cy="56" r="2.5" className="fill-ink" />
      <path d="M 96 50 C 104 44 108 42 112 42" strokeWidth={3} />
      <path d="M 96 58 C 106 56 110 56 113 58" strokeWidth={3} />
      <path d="M 46 78 v 8" strokeWidth={3} />
      <path d="M 60 80 v 8" strokeWidth={3} />
      <path d="M 74 78 v 8" strokeWidth={3} />
    </DishFrame>
  )
}
