import type { ComponentType } from 'react'
import { Barbecue } from './Barbecue'
import { Burger } from './Burger'
import { CoffeeBread } from './CoffeeBread'
import { Crustacean } from './Crustacean'
import { Dessert } from './Dessert'
import { Fish } from './Fish'
import { GenericPlate } from './GenericPlate'
import { Pasta } from './Pasta'
import { PizzaDish } from './PizzaDish'
import { RegionalPlate } from './RegionalPlate'
import { SaladBowl } from './SaladBowl'
import { Sushi } from './Sushi'
import { Tapioca } from './Tapioca'
import { pickDish } from './pickDish'
import type { DishKind } from './pickDish'
import type { DishProps } from './DishFrame'

const DISHES: Record<DishKind, ComponentType<DishProps>> = {
  sushi: Sushi,
  pizza: PizzaDish,
  hamburguer: Burger,
  crustaceos: Crustacean,
  peixe: Fish,
  tapioca: Tapioca,
  doce: Dessert,
  cafe: CoffeeBread,
  massa: Pasta,
  churrasco: Barbecue,
  regional: RegionalPlate,
  salada: SaladBowl,
  generico: GenericPlate,
}

export interface DishIllustrationProps {
  /** Nome do prato sugerido, ex.: "Camarão na moranga". */
  prato: string
  /** Categorias do restaurante, usadas quando o nome não ajuda. */
  categorias: string[]
  className?: string
  /** Ilustração decorativa (sem `role=img` nem `aria-label`). */
  decorative?: boolean
}

/**
 * Ilustração do prato: escolhe o desenho com `pickDish` e cuida do rótulo
 * acessível ("Ilustração de <prato>").
 */
export function DishIllustration({
  prato,
  categorias,
  className,
  decorative = false,
}: DishIllustrationProps) {
  const Dish = DISHES[pickDish(prato, categorias)]
  return (
    <Dish className={className} title={decorative ? undefined : `Ilustração de ${prato}`} />
  )
}
