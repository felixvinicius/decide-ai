import type { Coordinates, PriceLevel, QuizAnswers, Restaurant } from '../types'

export type RelaxedFilter = 'distancia' | 'preco'

export interface ScoredRestaurant {
  restaurante: Restaurant
  score: number
  /** Straight-line distance in km, or null when the user's position is unknown. */
  distanciaKm: number | null
  /** true/false when opening hours are known, null otherwise. */
  abertoAgora: boolean | null
}

export interface RecommendationResult {
  itens: ScoredRestaurant[]
  /** Filters that had to be loosened to reach the minimum number of results. */
  flexibilizados: RelaxedFilter[]
  /** Ready-to-show messages (pt-BR) describing what was loosened. */
  avisos: string[]
}

export interface RecommendationOptions {
  minResultados?: number
  maxResultados?: number
  /** Initial search radius in km. Loosened (removed) if there are too few results. */
  raioKm?: number
}

const DEFAULTS = { minResultados: 3, maxResultados: 5, raioKm: 15 }

const EARTH_RADIUS_KM = 6371

const toRad = (deg: number) => (deg * Math.PI) / 180

/** Great-circle distance between two points, in km (Haversine formula). */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/**
 * Whether a restaurant is open at `agora`.
 * Returns null when there is no opening-hours information for today (a weekday with no
 * entry means "unknown", not "closed"), unless yesterday's late-night range still covers now.
 * Ranges whose end is earlier than the start close after midnight.
 */
export function isOpenNow(restaurante: Restaurant, agora: Date): boolean | null {
  const day = agora.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
  const yesterday = ((day + 6) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6
  const hours = restaurante.horarioFuncionamento
  const today = hours[day]
  const prev = hours[yesterday]
  if (!today && !prev) return null

  const now = agora.getHours() * 60 + agora.getMinutes()

  for (const range of today ?? []) {
    const [from, to] = range.split('-').map(parseMinutes)
    if (to > from ? now >= from && now < to : now >= from) return true
  }
  for (const range of prev ?? []) {
    const [from, to] = range.split('-').map(parseMinutes)
    if (to < from && now < to) return true
  }
  // Hours are known for today (or yesterday) but none matched: closed.
  return today ? false : null
}

/** Position used for distance: GPS coordinates, or the centre of the chosen neighbourhood. */
export function resolveOrigin(
  location: QuizAnswers['location'],
  restaurantes: Restaurant[],
): Coordinates | null {
  if ('coords' in location) return location.coords
  const inBairro = restaurantes.filter((r) => r.bairro === location.bairro)
  if (inBairro.length === 0) return null
  return {
    latitude: inBairro.reduce((s, r) => s + r.latitude, 0) / inBairro.length,
    longitude: inBairro.reduce((s, r) => s + r.longitude, 0) / inBairro.length,
  }
}

/** Sorted, de-duplicated list of categories present in the data (for question 1). */
export function listCategories(restaurantes: Restaurant[]): string[] {
  return [...new Set(restaurantes.flatMap((r) => r.categorias))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
}

/** Sorted, de-duplicated list of neighbourhoods present in the data (for question 3). */
export function listNeighborhoods(restaurantes: Restaurant[]): string[] {
  return [...new Set(restaurantes.map((r) => r.bairro))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

const WEIGHTS = {
  ocasiao: 30,
  ambiente: 25,
  ambienteIndiferente: 10,
  proximidade: 30,
  proximidadeDesconhecida: 15,
  aberto: 15,
  fechado: -40,
  somenteLanche: -20,
} as const

/** Places that only serve sweets/coffee are not a meal: they only lead for quick bites. */
const SNACK_CATEGORIES = new Set(['doces', 'café'])

function score(
  restaurante: Restaurant,
  respostas: QuizAnswers,
  distanciaKm: number | null,
  abertoAgora: boolean | null,
  raioKm: number,
): number {
  let total = 0
  if (restaurante.ocasioes.includes(respostas.occasion)) total += WEIGHTS.ocasiao

  if (respostas.ambience === 'tanto faz') total += WEIGHTS.ambienteIndiferente
  else if (restaurante.ambiente.includes(respostas.ambience)) total += WEIGHTS.ambiente

  if (distanciaKm === null) total += WEIGHTS.proximidadeDesconhecida
  else total += WEIGHTS.proximidade * Math.max(0, 1 - distanciaKm / raioKm)

  if (abertoAgora === true) total += WEIGHTS.aberto
  else if (abertoAgora === false) total += WEIGHTS.fechado

  const somenteLanche =
    restaurante.categorias.length > 0 && restaurante.categorias.every((c) => SNACK_CATEGORIES.has(c))
  if (somenteLanche && respostas.occasion !== 'rápido') total += WEIGHTS.somenteLanche

  return Math.round(total * 10) / 10
}

/**
 * Recommends restaurants for a group.
 *
 * Hard filters: rejected categories (never loosened), max price and search radius.
 * If fewer than `minResultados` pass, the radius is dropped first, then the price
 * ceiling is raised one level at a time. Each loosening is reported in `avisos`.
 * Remaining candidates are ranked by occasion, ambience, proximity and opening hours.
 */
export function recomendar(
  respostas: QuizAnswers,
  restaurantes: Restaurant[],
  agora: Date = new Date(),
  options: RecommendationOptions = {},
): RecommendationResult {
  const { minResultados, maxResultados, raioKm } = { ...DEFAULTS, ...options }
  const origin = resolveOrigin(respostas.location, restaurantes)
  const rejected = new Set(respostas.excludedCategories)

  const candidates = restaurantes
    .filter((r) => !r.categorias.some((c) => rejected.has(c)))
    .map((restaurante) => ({
      restaurante,
      distanciaKm: origin ? haversineKm(origin, restaurante) : null,
      abertoAgora: isOpenNow(restaurante, agora),
    }))

  const select = (maxPrice: PriceLevel, radius: number | null) =>
    candidates.filter(
      (c) =>
        c.restaurante.faixaPreco <= maxPrice &&
        (radius === null || c.distanciaKm === null || c.distanciaKm <= radius),
    )

  const flexibilizados: RelaxedFilter[] = []
  const avisos: string[] = []
  let radius: number | null = raioKm
  let pool = select(respostas.maxPrice, radius)

  // 1st loosening: drop the radius, but only keep it if it actually adds options.
  if (pool.length < minResultados) {
    const wider = select(respostas.maxPrice, null)
    if (wider.length > pool.length) {
      radius = null
      pool = wider
      flexibilizados.push('distancia')
      avisos.push('Poucas opções por perto, então ampliamos a distância da busca.')
    }
  }

  // 2nd loosening: raise the price ceiling one level at a time, only if it adds options.
  if (pool.length < minResultados) {
    let maxPrice = respostas.maxPrice
    let widerPool = pool
    while (widerPool.length < minResultados && maxPrice < 4) {
      maxPrice = (maxPrice + 1) as PriceLevel
      widerPool = select(maxPrice, radius)
    }
    if (widerPool.length > pool.length) {
      pool = widerPool
      flexibilizados.push('preco')
      avisos.push('Poucas opções nesse orçamento, então incluímos lugares um pouco mais caros.')
    }
  }

  const itens = pool
    .map((c) => ({
      ...c,
      score: score(c.restaurante, respostas, c.distanciaKm, c.abertoAgora, raioKm),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.distanciaKm ?? Infinity) - (b.distanciaKm ?? Infinity) ||
        a.restaurante.nome.localeCompare(b.restaurante.nome, 'pt-BR'),
    )
    .slice(0, maxResultados)

  return { itens, flexibilizados, avisos }
}
