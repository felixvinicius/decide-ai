import { describe, expect, it } from 'vitest'
import { montarQuadros, sortearIndice } from './roleta'

/** Último item de uma lista de índices (evita depender de `Array.prototype.at`). */
function ultimo(indices: number[]): number {
  return indices[indices.length - 1]
}

describe('sortearIndice', () => {
  it('rng 0 devolve 0', () => {
    expect(sortearIndice(5, () => 0)).toBe(0)
  })

  it('rng logo abaixo de 1 devolve o último índice', () => {
    expect(sortearIndice(5, () => 0.999999)).toBe(4)
  })

  it('rng igual a 1 não escapa da faixa', () => {
    expect(sortearIndice(5, () => 1)).toBe(4)
  })

  it('total 1 sempre devolve 0', () => {
    for (const valor of [0, 0.25, 0.5, 0.999, 1]) {
      expect(sortearIndice(1, () => valor)).toBe(0)
    }
  })

  it('total menor que 1 lança RangeError', () => {
    expect(() => sortearIndice(0)).toThrow(RangeError)
    expect(() => sortearIndice(0.9)).toThrow(RangeError)
    expect(() => sortearIndice(-3)).toThrow(RangeError)
    expect(() => sortearIndice(Number.NaN)).toThrow(RangeError)
    expect(() => sortearIndice(Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })

  it('nunca sai da faixa numa varredura de 0 a 1', () => {
    const total = 7
    for (let passo = 0; passo <= 1000; passo += 1) {
      const valor = passo / 1000
      const indice = sortearIndice(total, () => valor)
      expect(indice).toBeGreaterThanOrEqual(0)
      expect(indice).toBeLessThan(total)
    }
  })

  it('varredura determinística dá distribuição aproximadamente uniforme', () => {
    const total = 4
    const amostras = 4000
    const contagens = Array.from({ length: total }, () => 0)
    for (let i = 0; i < amostras; i += 1) {
      // Sequência de baixa discrepância (parte fracionária do número áureo).
      const valor = (i * 0.6180339887498949) % 1
      contagens[sortearIndice(total, () => valor)] += 1
    }
    const esperado = amostras / total
    for (const contagem of contagens) {
      expect(Math.abs(contagem - esperado)).toBeLessThan(esperado * 0.1)
    }
  })
})

describe('montarQuadros', () => {
  it('termina exatamente no alvo para todos os alvos', () => {
    const total = 5
    for (let alvo = 0; alvo < total; alvo += 1) {
      expect(ultimo(montarQuadros(total, alvo))).toBe(alvo)
    }
  })

  it('normaliza alvo negativo ou fora da faixa', () => {
    expect(ultimo(montarQuadros(4, -1))).toBe(3)
    expect(ultimo(montarQuadros(4, 6))).toBe(2)
  })

  it('a quantidade de quadros é coerente com as voltas', () => {
    const total = 4
    const voltas = 3
    for (let alvo = 0; alvo < total; alvo += 1) {
      const quadros = montarQuadros(total, alvo, voltas)
      expect(quadros.length).toBe(voltas * total + alvo + 1)
      expect(quadros.length).toBeGreaterThanOrEqual(voltas * total + 1)
      expect(quadros.length).toBeLessThanOrEqual((voltas + 1) * total)
    }
  })

  it('mantém todos os índices dentro da faixa', () => {
    const total = 6
    const quadros = montarQuadros(total, 4, 2)
    expect(quadros.every((indice) => indice >= 0 && indice < total)).toBe(true)
  })

  it('voltas 0 devolve só o alvo', () => {
    expect(montarQuadros(5, 0, 0)).toEqual([0])
    expect(montarQuadros(5, 3, 0)).toEqual([3])
    expect(montarQuadros(3, -1, 0)).toEqual([2])
  })

  it('total menor que 1 lança RangeError', () => {
    expect(() => montarQuadros(0, 0)).toThrow(RangeError)
    expect(() => montarQuadros(-2, 1)).toThrow(RangeError)
    expect(() => montarQuadros(Number.NaN, 0)).toThrow(RangeError)
  })
})
