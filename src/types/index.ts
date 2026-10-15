export type PriceLevel = 1 | 2 | 3 | 4

export type Occasion = 'dia comum' | 'encontro' | 'comemoração' | 'rápido'

export type Ambience = 'casual' | 'romântico' | 'ao ar livre' | 'vista para o mar'

export type AmbiencePreference = Ambience | 'tanto faz'

export interface Restaurant {
  id: string
  nome: string
  bairro: string
  endereco: string
  latitude: number
  longitude: number
  categorias: string[]
  faixaPreco: PriceLevel
  ocasioes: Occasion[]
  ambiente: Ambience[]
  pratosSugeridos: string[]
  /** Opening hours per weekday (0 = Sunday ... 6 = Saturday) as "HH:MM-HH:MM" ranges. */
  horarioFuncionamento: Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, string[]>>
  verificado: boolean
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface QuizAnswers {
  excludedCategories: string[]
  maxPrice: PriceLevel
  /** Either GPS coordinates or a manually chosen neighborhood. */
  location: { coords: Coordinates } | { bairro: string }
  occasion: Occasion
  ambience: AmbiencePreference
}
