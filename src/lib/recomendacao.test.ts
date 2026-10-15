import { describe, expect, it } from 'vitest'
import type { Coordinates, QuizAnswers, Restaurant } from '../types'
import {
  haversineKm,
  isOpenNow,
  listCategories,
  listNeighborhoods,
  recomendar,
  resolveOrigin,
} from './recomendacao'

/**
 * Testes do motor de recomendação. Usamos restaurantes fictícios definidos aqui
 * (nunca o JSON real) para que o resultado seja determinístico e independente
 * dos dados de produção.
 */

const ORIGIN: Coordinates = { latitude: -3.73, longitude: -38.52 }
/** 1 grau de latitude corresponde a ~111,19 km. Todos os lugares ficam no mesmo meridiano. */
const KM_PER_DEG_LAT = 111.19

/** Coordenadas a `km` ao norte de ORIGIN. */
function atKm(km: number): Pick<Restaurant, 'latitude' | 'longitude'> {
  return { latitude: ORIGIN.latitude + km / KM_PER_DEG_LAT, longitude: ORIGIN.longitude }
}

let seq = 0
function makeRestaurant(overrides: Partial<Restaurant> = {}): Restaurant {
  seq += 1
  return {
    id: `r${seq}`,
    nome: `Lugar ${seq}`,
    bairro: 'Meireles',
    endereco: 'Rua de Teste, 100',
    latitude: ORIGIN.latitude,
    longitude: ORIGIN.longitude,
    categorias: ['Nordestina'],
    faixaPreco: 2,
    ocasioes: [],
    ambiente: [],
    pratosSugeridos: ['Prato do dia'],
    horarioFuncionamento: {},
    verificado: true,
    ...overrides,
  }
}

function makeAnswers(overrides: Partial<QuizAnswers> = {}): QuizAnswers {
  return {
    excludedCategories: [],
    maxPrice: 4,
    location: { coords: ORIGIN },
    occasion: 'dia comum',
    ambience: 'tanto faz',
    ...overrides,
  }
}

/** Quarta-feira 12:00 — relógio fixo para os testes de horário. */
const WED_NOON = new Date(2026, 0, 7, 12, 0)
/** Terça-feira 00:10 — usado para o fechamento depois da meia-noite. */
const TUE_0010 = new Date(2026, 0, 6, 0, 10)

describe('haversineKm', () => {
  it('retorna 0 para o mesmo ponto', () => {
    expect(haversineKm(ORIGIN, { ...ORIGIN })).toBe(0)
  })

  it('mede Centro -> Praia de Iracema em ~1,8 km', () => {
    const centro: Coordinates = { latitude: -3.7275, longitude: -38.5267 }
    const iracema: Coordinates = { latitude: -3.7218, longitude: -38.5107 }
    const distancia = haversineKm(centro, iracema)
    expect(distancia).toBeCloseTo(1.9, 1)
    expect(distancia).toBeGreaterThan(1.7)
    expect(distancia).toBeLessThan(2.0)
  })
})

describe('isOpenNow', () => {
  it('retorna true dentro do horário e false fora dele', () => {
    const restaurante = makeRestaurant({ horarioFuncionamento: { 3: ['11:00-15:00'] } })
    expect(isOpenNow(restaurante, WED_NOON)).toBe(true)
    expect(isOpenNow(restaurante, new Date(2026, 0, 7, 16, 0))).toBe(false)
  })

  it('retorna null quando não há dados de horário', () => {
    const restaurante = makeRestaurant({ horarioFuncionamento: {} })
    expect(isOpenNow(restaurante, WED_NOON)).toBeNull()
  })

  it('retorna null quando nem hoje nem ontem têm horário', () => {
    // Sexta-feira (5): nem quarta nem terça têm dados.
    const restaurante = makeRestaurant({ horarioFuncionamento: { 5: ['11:00-15:00'] } })
    expect(isOpenNow(restaurante, WED_NOON)).toBeNull()
  })

  it('abre depois da meia-noite quando a faixa de ontem cruza o dia', () => {
    // Segunda 18:00-00:30 — na terça às 00:10 ainda está aberto.
    const restaurante = makeRestaurant({ horarioFuncionamento: { 1: ['18:00-00:30'] } })
    expect(isOpenNow(restaurante, TUE_0010)).toBe(true)
    // Às 01:00 a janela da madrugada já passou. Como a terça não tem horário
    // cadastrado, o contrato atual devolve null (desconhecido) em vez de false
    // (fechado) — inconsistente com o true acima. Ver bug relatado no relatório.
    expect(isOpenNow(restaurante, new Date(2026, 0, 6, 1, 0))).toBeNull()
  })

  it('trata a faixa 00:00-00:00 como 24h', () => {
    const restaurante = makeRestaurant({ horarioFuncionamento: { 3: ['00:00-00:00'] } })
    expect(isOpenNow(restaurante, new Date(2026, 0, 7, 3, 30))).toBe(true)
    expect(isOpenNow(restaurante, new Date(2026, 0, 7, 23, 59))).toBe(true)
  })
})

describe('resolveOrigin', () => {
  it('usa as coordenadas quando informadas', () => {
    const restaurantes = [makeRestaurant()]
    expect(resolveOrigin({ coords: ORIGIN }, restaurantes)).toEqual(ORIGIN)
  })

  it('usa a média das coordenadas do bairro', () => {
    const restaurantes = [
      makeRestaurant({ bairro: 'Meireles', latitude: -3.73, longitude: -38.52 }),
      makeRestaurant({ bairro: 'Meireles', latitude: -3.74, longitude: -38.5 }),
      makeRestaurant({ bairro: 'Aldeota', latitude: -3.75, longitude: -38.49 }),
    ]
    const origem = resolveOrigin({ bairro: 'Meireles' }, restaurantes)
    expect(origem).not.toBeNull()
    expect(origem?.latitude).toBeCloseTo(-3.735, 6)
    expect(origem?.longitude).toBeCloseTo(-38.51, 6)
  })

  it('retorna null para um bairro sem restaurantes', () => {
    const restaurantes = [makeRestaurant({ bairro: 'Meireles' })]
    expect(resolveOrigin({ bairro: 'Inexistente' }, restaurantes)).toBeNull()
  })
})

describe('listCategories e listNeighborhoods', () => {
  const restaurantes = [
    makeRestaurant({ categorias: ['Pizza', 'Nordestina'], bairro: 'Meireles' }),
    makeRestaurant({ categorias: ['Nordestina'], bairro: 'Aldeota' }),
    makeRestaurant({ categorias: ['Pizza', 'Barzinho'], bairro: 'Meireles' }),
  ]

  it('lista categorias ordenadas e sem duplicatas', () => {
    expect(listCategories(restaurantes)).toEqual(['Barzinho', 'Nordestina', 'Pizza'])
  })

  it('lista bairros ordenados e sem duplicatas', () => {
    expect(listNeighborhoods(restaurantes)).toEqual(['Aldeota', 'Meireles'])
  })
})

describe('recomendar', () => {
  it('exclui restaurantes de categorias rejeitadas', () => {
    const restaurantes = [
      makeRestaurant({ id: 'a', categorias: ['Nordestina'], ...atKm(1) }),
      makeRestaurant({ id: 'b', categorias: ['Pizza'], ...atKm(2) }),
      makeRestaurant({ id: 'c', categorias: ['Japonesa'], ...atKm(3) }),
      makeRestaurant({ id: 'd', categorias: ['Vegetariana'], ...atKm(4) }),
    ]
    const resultado = recomendar(
      makeAnswers({ excludedCategories: ['Pizza'] }),
      restaurantes,
      WED_NOON,
    )
    expect(resultado.itens).toHaveLength(3)
    expect(resultado.itens.every((i) => !i.restaurante.categorias.includes('Pizza'))).toBe(true)
  })

  it('respeita a faixa de preço máxima', () => {
    const restaurantes = [
      makeRestaurant({ id: 'barato1', faixaPreco: 1, ...atKm(1) }),
      makeRestaurant({ id: 'barato2', faixaPreco: 2, ...atKm(2) }),
      makeRestaurant({ id: 'barato3', faixaPreco: 2, ...atKm(3) }),
      makeRestaurant({ id: 'caro1', faixaPreco: 3, ...atKm(1) }),
      makeRestaurant({ id: 'caro2', faixaPreco: 4, ...atKm(2) }),
    ]
    const resultado = recomendar(makeAnswers({ maxPrice: 2 }), restaurantes, WED_NOON)
    expect(resultado.itens).toHaveLength(3)
    expect(resultado.itens.every((i) => i.restaurante.faixaPreco <= 2)).toBe(true)
  })

  it('pontua a ocasião: quem bate com a ocasião fica à frente', () => {
    const bate = makeRestaurant({ id: 'bate', nome: 'Zebra', ocasioes: ['encontro'], ...atKm(2) })
    const naoBate = makeRestaurant({ id: 'naoBate', nome: 'Abelha', ocasioes: ['rápido'], ...atKm(2) })
    const extra = makeRestaurant({ id: 'extra', nome: 'Cavalo', ocasioes: [], ...atKm(2) })
    const resultado = recomendar(
      makeAnswers({ occasion: 'encontro', ambience: 'tanto faz' }),
      [bate, naoBate, extra],
      WED_NOON,
    )
    expect(resultado.itens[0].restaurante.id).toBe('bate')
  })

  it('pontua o ambiente: quem bate com o ambiente fica à frente', () => {
    const romantico = makeRestaurant({ id: 'rom', nome: 'Zebra', ambiente: ['romântico'], ...atKm(2) })
    const casual = makeRestaurant({ id: 'casual', nome: 'Abelha', ambiente: ['casual'], ...atKm(2) })
    const extra = makeRestaurant({ id: 'extra', nome: 'Cavalo', ambiente: [], ...atKm(2) })
    const resultado = recomendar(
      makeAnswers({ ambience: 'romântico' }),
      [romantico, casual, extra],
      WED_NOON,
    )
    expect(resultado.itens[0].restaurante.id).toBe('rom')
  })

  it("não filtra quando o ambiente é 'tanto faz'", () => {
    const semAmbiente = makeRestaurant({ id: 'sem', ambiente: [], ...atKm(2) })
    const restaurantes = [
      semAmbiente,
      makeRestaurant({ id: 'a', ambiente: ['casual'], ...atKm(3) }),
      makeRestaurant({ id: 'b', ambiente: ['romântico'], ...atKm(4) }),
    ]
    const resultado = recomendar(makeAnswers({ ambience: 'tanto faz' }), restaurantes, WED_NOON)
    expect(resultado.itens.map((i) => i.restaurante.id)).toContain('sem')
  })

  it('coloca o lugar mais perto à frente do mais longe quando o resto empata', () => {
    const perto = makeRestaurant({ id: 'perto', nome: 'Zzz', ...atKm(1) })
    const longe = makeRestaurant({ id: 'longe', nome: 'Aaa', ...atKm(8) })
    const extra = makeRestaurant({ id: 'extra', nome: 'Mmm', ...atKm(12) })
    const resultado = recomendar(makeAnswers(), [perto, longe, extra], WED_NOON)
    expect(resultado.itens[0].restaurante.id).toBe('perto')
  })

  it('coloca o lugar aberto à frente do fechado', () => {
    const aberto = makeRestaurant({
      id: 'aberto',
      nome: 'Zzz',
      horarioFuncionamento: { 3: ['00:00-00:00'] },
      ...atKm(5),
    })
    const fechado = makeRestaurant({
      id: 'fechado',
      nome: 'Aaa',
      horarioFuncionamento: { 3: ['00:00-00:01'] },
      ...atKm(5),
    })
    const extra = makeRestaurant({ id: 'extra', nome: 'Mmm', ...atKm(5) })
    const resultado = recomendar(makeAnswers(), [aberto, fechado, extra], WED_NOON)
    expect(resultado.itens[0].restaurante.id).toBe('aberto')
  })

  it('retorna no máximo 5 itens ordenados por score decrescente', () => {
    const restaurantes = Array.from({ length: 7 }, (_, index) =>
      makeRestaurant({ id: `r${index}`, nome: `Lugar ${index}`, ...atKm(index + 1) }),
    )
    const resultado = recomendar(makeAnswers(), restaurantes, WED_NOON)
    expect(resultado.itens).toHaveLength(5)
    const scores = resultado.itens.map((i) => i.score)
    for (let i = 1; i < scores.length; i += 1) {
      expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i])
    }
  })

  it('flexibiliza só a distância quando faltam resultados por causa do raio', () => {
    const restaurantes = [
      makeRestaurant({ id: 'a', ...atKm(1) }),
      makeRestaurant({ id: 'b', ...atKm(2) }),
      makeRestaurant({ id: 'c', ...atKm(10) }),
    ]
    const resultado = recomendar(makeAnswers(), restaurantes, WED_NOON, { raioKm: 3 })
    expect(resultado.itens).toHaveLength(3)
    expect(resultado.flexibilizados).toEqual(['distancia'])
    expect(resultado.avisos).toHaveLength(1)
  })

  it('flexibiliza distância e depois preço, sem nunca relaxar categorias excluídas', () => {
    const restaurantes = [
      makeRestaurant({ id: 'a', faixaPreco: 2, ...atKm(1) }),
      makeRestaurant({ id: 'b', faixaPreco: 2, ...atKm(12) }),
      makeRestaurant({ id: 'c', faixaPreco: 3, ...atKm(2) }),
      makeRestaurant({ id: 'd', faixaPreco: 3, ...atKm(2) }),
      // Seria o melhor colocado, mas está numa categoria rejeitada e nunca volta.
      makeRestaurant({ id: 'e', faixaPreco: 1, categorias: ['Pizza'], ...atKm(0.5) }),
    ]
    const resultado = recomendar(
      makeAnswers({ maxPrice: 2, excludedCategories: ['Pizza'] }),
      restaurantes,
      WED_NOON,
      { raioKm: 3 },
    )
    expect(resultado.flexibilizados).toEqual(['distancia', 'preco'])
    expect(resultado.avisos).toHaveLength(2)
    expect(resultado.itens.some((i) => i.restaurante.id === 'e')).toBe(false)
  })

  it('não registra distancia e mantém o raio quando removê-lo não adiciona ninguém', () => {
    const restaurantes = [
      makeRestaurant({ id: 'a', faixaPreco: 2, ...atKm(1) }),
      // Dentro do raio, mas acima do preço: só entram se o teto de preço subir.
      makeRestaurant({ id: 'c', faixaPreco: 3, ...atKm(2) }),
      makeRestaurant({ id: 'd', faixaPreco: 3, ...atKm(2) }),
      // Distante e caro: não pode entrar sem aviso de distância.
      makeRestaurant({ id: 'f', faixaPreco: 3, ...atKm(12) }),
    ]
    const resultado = recomendar(
      makeAnswers({ maxPrice: 2 }),
      restaurantes,
      WED_NOON,
      { raioKm: 3 },
    )
    expect(resultado.flexibilizados).not.toContain('distancia')
    expect(resultado.flexibilizados).toEqual(['preco'])
    expect(resultado.avisos).toHaveLength(1)
    // O raio continua valendo na etapa de preço, então o lugar distante não entra.
    expect(resultado.itens.some((i) => i.restaurante.id === 'f')).toBe(false)
  })

  it('não registra preco quando subir o teto não adiciona ninguém', () => {
    const restaurantes = [
      makeRestaurant({ id: 'a', faixaPreco: 1, categorias: ['Pizza'] }),
      makeRestaurant({ id: 'b', faixaPreco: 4, categorias: ['Pizza', 'Barzinho'] }),
    ]
    const resultado = recomendar(
      makeAnswers({ maxPrice: 2, excludedCategories: ['Pizza'] }),
      restaurantes,
      WED_NOON,
    )
    expect(resultado.flexibilizados).toEqual([])
    expect(resultado.avisos).toEqual([])
    expect(resultado.itens).toEqual([])
  })

  it('retorna vazio quando nada passa nos filtros', () => {
    const restaurantes = [
      makeRestaurant({ id: 'a', categorias: ['Pizza'] }),
      makeRestaurant({ id: 'b', categorias: ['Pizza', 'Barzinho'] }),
    ]
    const resultado = recomendar(
      makeAnswers({ excludedCategories: ['Pizza'] }),
      restaurantes,
      WED_NOON,
    )
    expect(resultado.itens).toEqual([])
  })

  it('retorna vazio quando não há restaurantes', () => {
    const resultado = recomendar(makeAnswers(), [], WED_NOON)
    expect(resultado.itens).toEqual([])
  })
})
