import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Prato com talheres: fallback quando não dá pra adivinhar o prato. */
export function GenericPlate({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <path d="M 16 26 v 16" />
      <path d="M 28 26 v 16" />
      <path d="M 16 42 h 12" />
      <path d="M 22 42 v 52" />
      <path d="M 96 26 c 8 8 8 22 0 30 z" className="fill-sand-400" />
      <path d="M 96 30 v 64" />
      <circle cx="60" cy="60" r="28" className="fill-cream" />
      <circle cx="60" cy="60" r="19" className="fill-sand-100" />
    </DishFrame>
  )
}
