import { useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { recomendar } from '../lib/recomendacao'
import type { ScoredRestaurant } from '../lib/recomendacao'
import { Results } from '../pages/Results'
import type { QuizAnswers, Restaurant } from '../types'
import { Roleta } from './Roleta'
import { googleMapsUrl } from './maps'

// Só o motor é mockado (a Roleta só importa o tipo dele): a tela recebe itens prontos.
vi.mock('../lib/recomendacao', () => ({ recomendar: vi.fn() }))

const recomendarMock = vi.mocked(recomendar)

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

const ITENS: ScoredRestaurant[] = [
  makeItem({ nome: 'Cantina do Caju', endereco: 'Rua A, 1' }),
  makeItem({ nome: 'Peixada da Praia', endereco: 'Rua B, 2' }),
  makeItem({ nome: 'Tapiocaria Sol', endereco: 'Rua C, 3' }),
]

const ANSWERS: QuizAnswers = {
  excludedCategories: [],
  maxPrice: 3,
  location: { coords: { latitude: -3.73, longitude: -38.52 } },
  occasion: 'encontro',
  ambience: 'tanto faz',
}

/** Monta a roleta por fora, com um botão de origem pra testar a volta do foco. */
function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir roleta
      </button>
      {open && <Roleta itens={ITENS} onClose={() => setOpen(false)} />}
    </>
  )
}

/** Faz `window.matchMedia` responder `matches` pra qualquer consulta. */
function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

/** Deixa a roleta terminar o giro: os quadros somam bem menos que 10s. */
function terminarGiro() {
  act(() => {
    vi.advanceTimersByTime(10_000)
  })
}

beforeEach(() => {
  recomendarMock.mockReset()
  vi.useFakeTimers()
  // Math.random = 0 => sortearIndice devolve 0 => o alvo é sempre o primeiro item.
  vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  Reflect.deleteProperty(window as unknown as Record<string, unknown>, 'matchMedia')
})

describe('Roleta — abertura e foco', () => {
  it('abre como diálogo modal e leva o foco pra dentro', () => {
    render(<Roleta itens={ITENS} onClose={() => {}} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveFocus()
  })

  it('deixa o #root inert enquanto aberto e devolve ao fechar', () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    const { unmount } = render(<Roleta itens={ITENS} onClose={() => {}} />)
    expect(root).toHaveAttribute('inert')

    unmount()
    expect(root).not.toHaveAttribute('inert')
    root.remove()
  })
})

describe('Roleta — giro e resultado', () => {
  it('gira (aria-hidden) e depois mostra o resultado na região aria-live', () => {
    render(<Roleta itens={ITENS} onClose={() => {}} />)

    const giro = screen.getByText('Rodando a roleta…').parentElement
    expect(giro).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByText(/Hoje é dia de/)).toBeNull()

    terminarGiro()

    const resultado = screen.getByText('Hoje é dia de Cantina do Caju!')
    const live = document.querySelector('[aria-live="polite"]')
    expect(live).not.toBeNull()
    expect(live).toContainElement(resultado)
    expect(screen.queryByText('Rodando a roleta…')).toBeNull()
  })

  it('Sortear de novo gira outra vez e volta ao resultado', () => {
    render(<Roleta itens={ITENS} onClose={() => {}} />)
    terminarGiro()
    expect(screen.getByText('Hoje é dia de Cantina do Caju!')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /sortear de novo/i }))
    expect(screen.queryByText(/Hoje é dia de/)).toBeNull()
    expect(screen.getByText('Rodando a roleta…')).toBeInTheDocument()

    terminarGiro()
    expect(screen.getByText('Hoje é dia de Cantina do Caju!')).toBeInTheDocument()
  })

  it('com prefers-reduced-motion mostra o resultado direto, sem giro nem timers', () => {
    stubMatchMedia(true)
    render(<Roleta itens={ITENS} onClose={() => {}} />)

    expect(screen.getByText('Hoje é dia de Cantina do Caju!')).toBeInTheDocument()
    expect(screen.queryByText('Rodando a roleta…')).toBeNull()
  })
})

describe('Roleta — teclado e foco preso', () => {
  it('Esc fecha e devolve o foco pro botão de origem', () => {
    render(<Harness />)
    const origem = screen.getByRole('button', { name: 'Abrir roleta' })
    origem.focus()
    fireEvent.click(origem)

    expect(screen.getByRole('dialog')).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(origem).toHaveFocus()
  })

  it('prende o Tab e o Shift+Tab no diálogo', () => {
    render(<Roleta itens={ITENS} onClose={() => {}} />)
    terminarGiro()

    const dialog = screen.getByRole('dialog')
    const primeiro = screen.getByRole('link', { name: /abrir no google maps/i })
    const ultimo = screen.getByRole('button', { name: 'Fechar' })

    ultimo.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(primeiro).toHaveFocus()

    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    expect(ultimo).toHaveFocus()
  })

  it('fechar no meio do giro não deixa timers pendentes', () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir roleta' }))
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(screen.getByText('Rodando a roleta…')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('Results — Decide por mim', () => {
  function renderResults(itens: ScoredRestaurant[]) {
    recomendarMock.mockReturnValue({ itens, flexibilizados: [], avisos: [] })
    render(<Results answers={ANSWERS} onRestart={() => {}} />)
  }

  it('só oferece a roleta com 2 ou mais opções', () => {
    renderResults([makeItem()])
    expect(screen.queryByRole('button', { name: /decide por mim/i })).toBeNull()
  })

  it('mostra o botão Decide por mim quando há 2 ou mais opções', () => {
    renderResults([makeItem(), makeItem()])
    expect(screen.getByRole('button', { name: /decide por mim/i })).toBeInTheDocument()
  })

  it('o link do Maps da roleta usa o mesmo href do cartão', () => {
    const itens = [
      makeItem({ nome: 'Cantina do Caju', endereco: 'Rua A, 1' }),
      makeItem({ nome: 'Peixada da Praia', endereco: 'Rua B, 2' }),
    ]
    renderResults(itens)

    fireEvent.click(screen.getByRole('button', { name: /decide por mim/i }))
    terminarGiro()

    const links = screen.getAllByRole('link', { name: /cantina do caju/i })
    expect(links).toHaveLength(2)
    const esperado = googleMapsUrl(itens[0].restaurante)
    for (const link of links) {
      expect(link.getAttribute('href')).toBe(esperado)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel') ?? '').toContain('noopener')
    }
  })
})
