/**
 * Deixa só a primeira letra em maiúscula, sem mexer no resto do texto:
 * "frutos do mar" → "Frutos do mar". É só pra exibição — o valor que circula
 * pelo app continua exatamente como está nos dados.
 */
export function capitalizeLabel(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}
