/**
 * Sorteio da roleta do "Decide por mim". Lógica pura, sem UI: dá pra testar
 * passando um `rng` de mentira e conferir a sequência de quadros.
 */

/**
 * Sorteia um índice com a mesma chance pra cada opção, em `[0, total-1]`.
 * `rng` é injetável pra testar; o padrão é o `Math.random`.
 */
export function sortearIndice(total: number, rng: () => number = Math.random): number {
  const quantos = Math.floor(total)
  if (!Number.isFinite(total) || quantos < 1) {
    throw new RangeError('sortearIndice precisa de total >= 1')
  }

  const valor = rng()
  // rng fora do intervalo (inclusive 1) não pode escapar da faixa.
  if (!Number.isFinite(valor)) return 0
  return Math.min(quantos - 1, Math.max(0, Math.floor(valor * quantos)))
}

/**
 * Sequência de índices que a roleta mostra, terminando exatamente em `alvo`.
 * Antes de parar ela dá `voltas` voltas completas, passando por todas as
 * opções em cada uma. Sem voltas (`voltas = 0`), mostra só o quadro do alvo.
 */
export function montarQuadros(total: number, alvo: number, voltas = 3): number[] {
  const quantos = Math.floor(total)
  if (!Number.isFinite(total) || quantos < 1) {
    throw new RangeError('montarQuadros precisa de total >= 1')
  }

  const parada = ((Math.trunc(alvo) % quantos) + quantos) % quantos
  const voltasInteiras = Math.max(0, Math.floor(voltas))
  // Sem voltas completas não há giro: devolve só o alvo.
  if (voltasInteiras === 0) return [parada]

  const passos = voltasInteiras * quantos + parada + 1
  return Array.from({ length: passos }, (_, indice) => indice % quantos)
}
