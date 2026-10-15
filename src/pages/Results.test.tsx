import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { recomendar } from '../lib/recomendacao'
import type { ScoredRestaurant } from '../lib/recomendacao'
import { Results } from './Results'
import type { QuizAnswers, Restaurant } from '../types'

// Só o motor é mockado: a tela recebe itens prontos e fictícios.
vi.mock('../lib/recomendacao', () => ({ recomendar: vi.fn() }))

const recomendarMock = vi.mocked(recomendar)

const ANSWERS: QuizAnswers = {
  excludedCategories: [],
  maxPrice: 3,
  location: { coords: { latitude: -3.73, longitude: -38.52 } },
  occasion: 'encontro',
  ambience: 'tanto faz',
}

let seq = 0
function makeRestaurant(overrides: Partial<Restaurant> = {}): Restaurant {
  seq += 1
  return {
    id: `r${seq}`,
    nome: `Lugar ${seq}`,
    bairro: 'Meireles',
    endereco: 'Rua de Teste, 100',
    latitude: -3.73,
    longitude: -38.52,
    categorias: ['regional'],
    faixaPreco: 2,
    ocasioes: [],
    ambiente: [],
    pratosSugeridos: ['Carne de sol com macaxeira'],
    horarioFuncionamento: {},
    verificado: true,
    ...overrides,
  }
}

function makeItem(
  restaurante: Partial<Restaurant> = {},
  overrides: Partial<ScoredRestaurant> = {},
): ScoredRestaurant {
  return {
    restaurante: makeRestaurant(restaurante),
    score: 10,
    distanciaKm: 1.8,
    abertoAgora: true,
    ...overrides,
  }
}

function setResult(itens: ScoredRestaurant[], avisos: string[] = []) {
  recomendarMock.mockReturnValue({ itens, flexibilizados: [], avisos })
}

function renderResults() {
  const onRestart = vi.fn()
  render(<Results answers={ANSWERS} onRestart={onRestart} />)
  return { onRestart }
}

const h1 = () => screen.getByRole('heading', { level: 1 })

beforeEach(() => {
  recomendarMock.mockReset()
})

describe('Results — título', () => {
  it('usa o plural para vários lugares', () => {
    setResult([makeItem(), makeItem(), makeItem()])
    renderResults()
    expect(h1()).toHaveTextContent('Achamos 3 lugares pra vocês')
  })

  it('usa o singular para um lugar só', () => {
    setResult([makeItem()])
    renderResults()
    expect(h1()).toHaveTextContent('Achamos 1 lugar pra vocês')
  })
})

describe('Results — estado vazio', () => {
  it('mostra o recado de vazio e o botão Refazer', () => {
    setResult([], [])
    renderResults()
    expect(h1()).toHaveTextContent('Não achamos nada com esse combo')
    expect(screen.getByRole('button', { name: /refazer/i })).toBeInTheDocument()
    expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0)
  })
})

describe('Results — avisos', () => {
  it('mostra os avisos numa região role=status', () => {
    setResult([makeItem()], ['Poucas opções por perto.'])
    renderResults()
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Poucas opções por perto.')
  })

  it('não cria role=status quando não há avisos', () => {
    setResult([makeItem()], [])
    renderResults()
    expect(screen.queryByRole('status')).toBeNull()
  })
})

describe('Results — link do Google Maps', () => {
  it('aponta para a busca do Maps e abre em nova aba com rel seguro', () => {
    setResult([makeItem({ nome: 'Cantina do Caju' })])
    renderResults()

    const link = screen.getByRole('link', { name: /cantina do caju/i })
    const href = link.getAttribute('href') ?? ''
    expect(href.startsWith('https://www.google.com/maps/search/?api=1&query=')).toBe(true)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel') ?? '').toContain('noopener')
  })
})

describe('Results — selo Aberto/Fechado', () => {
  it('mostra Aberto agora quando abertoAgora é true', () => {
    setResult([makeItem({}, { abertoAgora: true })])
    renderResults()
    expect(screen.getByText('Aberto agora')).toBeInTheDocument()
    expect(screen.queryByText('Fechado agora')).toBeNull()
  })

  it('mostra Fechado agora quando abertoAgora é false', () => {
    setResult([makeItem({}, { abertoAgora: false })])
    renderResults()
    expect(screen.getByText('Fechado agora')).toBeInTheDocument()
    expect(screen.queryByText('Aberto agora')).toBeNull()
  })

  it('não mostra selo quando abertoAgora é null', () => {
    setResult([makeItem({}, { abertoAgora: null })])
    renderResults()
    expect(screen.queryByText(/agora/i)).toBeNull()
  })
})

describe('Results — distância', () => {
  it('formata metros, km com vírgula e km arredondado', () => {
    setResult([
      makeItem({ nome: 'Perto' }, { distanciaKm: 0.7 }),
      makeItem({ nome: 'Meio' }, { distanciaKm: 1.8 }),
      makeItem({ nome: 'Longe' }, { distanciaKm: 12 }),
    ])
    renderResults()
    expect(screen.getByText('~700 m de você')).toBeInTheDocument()
    expect(screen.getByText('~1,8 km de você')).toBeInTheDocument()
    expect(screen.getByText('~12 km de você')).toBeInTheDocument()
  })

  it('não mostra distância quando é null', () => {
    setResult([makeItem({}, { distanciaKm: null })])
    renderResults()
    expect(screen.queryByText(/de você/)).toBeNull()
  })
})

describe('Results — acessibilidade', () => {
  it('leva o foco para o h1 quando a tela abre', async () => {
    setResult([makeItem()])
    renderResults()
    await waitFor(() => expect(document.activeElement).toBe(h1()))
  })

  it('descreve a faixa de preço com o número, não só com os cifrões', () => {
    setResult([makeItem({ faixaPreco: 3 })])
    renderResults()
    expect(screen.getByRole('img', { name: 'Faixa de preço: 3 de 4' })).toBeInTheDocument()
  })
})

describe('Results — Refazer', () => {
  it('chama onRestart ao clicar', () => {
    setResult([makeItem()])
    const { onRestart } = renderResults()
    fireEvent.click(screen.getByRole('button', { name: /refazer/i }))
    expect(onRestart).toHaveBeenCalledTimes(1)
  })
})
