import type { Restaurant } from '../types'

/**
 * Link de busca no Google Maps montado pelo endereço: as coordenadas do
 * cadastro são aproximadas e não servem pra navegar.
 */
export function googleMapsUrl(restaurante: Restaurant): string {
  const query = `${restaurante.nome}, ${restaurante.endereco}, Fortaleza`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
