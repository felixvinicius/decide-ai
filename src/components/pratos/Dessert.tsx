import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Sorvete de casquinha com cereja (sobremesa). */
export function Dessert({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <path d="M 44 62 L 60 104 L 76 62 z" className="fill-sand-400" />
      <path d="M 50 76 h 20" strokeWidth={2.5} className="stroke-sand-500" />
      <path d="M 54 88 h 12" strokeWidth={2.5} className="stroke-sand-500" />
      <circle cx="50" cy="52" r="15" className="fill-caju-300" />
      <circle cx="70" cy="54" r="13" className="fill-sol-400" />
      <circle cx="60" cy="34" r="5" className="fill-caju-700" />
      <path d="M 60 29 c 0 -5 4 -7 8 -8" strokeWidth={2.5} className="stroke-mar-600" />
    </DishFrame>
  )
}
