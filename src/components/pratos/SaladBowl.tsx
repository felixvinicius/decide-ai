import { DishFrame } from './DishFrame'
import type { DishProps } from './DishFrame'

/** Bowl de salada com folhas e tomate. */
export function SaladBowl({ className, title }: DishProps) {
  return (
    <DishFrame title={title} className={className}>
      <path d="M 20 62 c 0 22 18 34 40 34 s 40 -12 40 -34 z" className="fill-cream" />
      <circle cx="40" cy="56" r="13" className="fill-mar-300" />
      <circle cx="62" cy="48" r="14" className="fill-mar-400" />
      <circle cx="82" cy="58" r="11" className="fill-mar-300" />
      <circle cx="50" cy="60" r="6" className="fill-caju-500" />
      <circle cx="72" cy="62" r="5" className="fill-sol-400" />
      <circle cx="60" cy="68" r="4.5" className="fill-white" />
    </DishFrame>
  )
}
