import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Shuffle } from 'lucide-react'
import { Button } from './Button'
import { LinkButton } from './LinkButton'
import { googleMapsUrl } from './maps'
import { DishIllustration } from './pratos/DishIllustration'
import { montarQuadros, sortearIndice } from '../lib/roleta'
import type { ScoredRestaurant } from '../lib/recomendacao'

export interface RoletaProps {
  /** Opções do sorteio: todas com a mesma chance. */
  itens: ScoredRestaurant[]
  /** Fecha a roleta (Esc, clique no fundo ou botão Fechar). */
  onClose: () => void
}

/** Altura de cada quadro da roleta, igual ao `h-24` da janelinha. */
const FRAME_HEIGHT = 96
/** Ritmo do giro: rápido no começo, devagar no fim. */
const FIRST_DELAY_MS = 60
const LAST_DELAY_MS = 400

/** Tempo que o quadro `index` demora pra entrar na janelinha (60ms → 400ms). */
function frameDelayMs(index: number, totalFrames: number): number {
  if (totalFrames <= 1) return LAST_DELAY_MS
  const progress = index / (totalFrames - 1)
  return FIRST_DELAY_MS + (LAST_DELAY_MS - FIRST_DELAY_MS) * progress * progress
}

interface Spin {
  /** Índices que passam pela janelinha, o último é o sorteado. */
  frames: number[]
  target: number
}

function newSpin(total: number): Spin {
  const target = sortearIndice(total)
  // Mais voltas quando tem pouca opção: o giro dura de ~2,8s a ~3,5s em qualquer caso.
  const laps = Math.max(3, Math.round(15 / total))
  return { frames: montarQuadros(total, target, laps), target }
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Roleta do "Decide por mim": diálogo modal que passa pelas opções e para na
 * sorteada. O giro é só visual (aria-hidden) — quem usa leitor de tela recebe
 * o resultado pela região `aria-live`.
 */
export function Roleta({ itens, onClose }: RoletaProps) {
  const reduceMotion = useReducedMotion()
  // O framer resolve o media query quando o módulo carrega, então a checagem
  // direta na montagem deixa o caminho previsível (e testável).
  const [mediaReduce] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const preferReduce = reduceMotion === true || mediaReduce === true
  const total = itens.length
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<number[]>([])
  const [spin, setSpin] = useState<Spin>(() => newSpin(Math.max(1, total)))
  // Sem animação, a roleta já nasce parada no resultado.
  const [frame, setFrame] = useState(() => (preferReduce ? spin.frames.length - 1 : 0))
  const [done, setDone] = useState(false)
  const [draws, setDraws] = useState(0)

  // Sem item sorteado não existe diálogo (lista vazia) — e aí a página de fundo
  // não é mexida: nem `inert`, nem rolagem travada.
  const item = itens[spin.target]
  const hasDialog = item !== undefined

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  // Um timeout por quadro, desacelerando até parar. Nada continua rodando
  // depois de fechar: o cleanup limpa todos.
  useEffect(() => {
    clearTimers()

    // Sem diálogo não existe giro; com "menos animação" o resultado já está na tela.
    if (!hasDialog || preferReduce) return clearTimers

    let elapsed = 0
    for (let index = 1; index < spin.frames.length; index += 1) {
      elapsed += frameDelayMs(index, spin.frames.length)
      const isLast = index === spin.frames.length - 1
      const id = window.setTimeout(() => {
        setFrame(index)
        if (isLast) setDone(true)
      }, elapsed)
      timersRef.current.push(id)
    }

    return clearTimers
  }, [spin, preferReduce, hasDialog, clearTimers])

  // Fundo inerte e sem rolagem, foco no diálogo e devolução pro botão de origem.
  // Só quando o diálogo existe de verdade (lista com pelo menos 1 opção).
  useEffect(() => {
    if (!hasDialog) return

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const root = document.getElementById('root')
    const previousOverflow = document.body.style.overflow
    root?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    return () => {
      root?.removeAttribute('inert')
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [hasDialog])

  // Esc fecha de qualquer lugar do diálogo.
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [onClose])

  const drawAgain = useCallback(() => {
    const next = newSpin(Math.max(1, total))
    setSpin(next)
    setFrame(preferReduce ? next.frames.length - 1 : 0)
    setDone(false)
    setDraws((current) => current + 1)
  }, [preferReduce, total])

  // Prende o Tab dentro do diálogo (o resto da página fica inerte).
  function handleDialogKeydown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab') return
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (!focusables || focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (
      (event.shiftKey && document.activeElement === first) ||
      (event.shiftKey && document.activeElement === dialogRef.current)
    ) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!item) return null

  const chosen = item.restaurante
  const dish = chosen.pratosSugeridos[0]
  const showingResult = done || preferReduce

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleDialogKeydown}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.25, ease: 'easeOut' }}
        className="flex max-h-[85dvh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-3xl border border-sand-200 bg-cream p-5 shadow-lift"
      >
        <h2 id={titleId} className="font-display text-xl font-semibold text-ink">
          Decide por mim
        </h2>

        {showingResult ? null : (
          <div aria-hidden="true" className="flex flex-col gap-2">
            <div className="h-24 overflow-hidden rounded-2xl border border-sand-200 bg-white">
              <motion.div
                className="flex flex-col"
                animate={{ y: -frame * FRAME_HEIGHT }}
                transition={{
                  duration: reduceMotion ? 0 : frameDelayMs(frame, spin.frames.length) / 1000,
                  ease: 'easeOut',
                }}
              >
                {spin.frames.map((index, position) => {
                  const option = itens[index]
                  return (
                    <div
                      key={position}
                      className="flex h-24 shrink-0 items-center gap-3 border-b border-sand-100 px-3"
                    >
                      <DishIllustration
                        prato={option?.restaurante.pratosSugeridos[0] ?? 'Prato do dia'}
                        categorias={option?.restaurante.categorias ?? []}
                        decorative
                        className="size-14 shrink-0"
                      />
                      <span className="min-w-0 flex-1 truncate font-display text-lg font-semibold text-ink">
                        {option?.restaurante.nome ?? ''}
                      </span>
                    </div>
                  )
                })}
              </motion.div>
            </div>
            <p className="text-center text-sm text-ink-soft">Rodando a roleta…</p>
          </div>
        )}

        {/* Região ao vivo sempre no DOM (uma só, pra não anunciar duplicado):
            durante o giro avisa "Sorteando…" e depois troca pelo resultado. */}
        <div role="status" aria-live="polite" className="flex flex-col gap-3">
          {showingResult ? (
            <motion.div
              key={`result-${draws}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.15 : 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <DishIllustration
                prato={dish ?? 'Prato do dia'}
                categorias={chosen.categorias}
                decorative
                className="size-32"
              />
              <p className="font-display text-sm font-semibold tracking-wide text-mar-700 uppercase">
                Deu certo
              </p>
              <h3 className="font-display text-2xl text-ink">Hoje é dia de {chosen.nome}!</h3>
              {dish && <p className="text-sm text-ink-soft">Prato sugerido: {dish}</p>}
              <p className="text-sm text-ink-soft">{chosen.bairro}</p>
            </motion.div>
          ) : (
            <p className="sr-only">Sorteando…</p>
          )}
        </div>

        {showingResult && (
          <LinkButton
            variant="primary"
            fullWidth
            href={googleMapsUrl(chosen)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir no Google Maps: ${chosen.nome} (abre em nova aba)`}
          >
            <ExternalLink aria-hidden="true" className="size-5 shrink-0" />
            Abrir no Google Maps
          </LinkButton>
        )}

        <div className="flex flex-col gap-2">
          {showingResult && (
            <Button key="draw-again" variant="secondary" fullWidth onClick={drawAgain}>
              <Shuffle aria-hidden="true" className="size-5 shrink-0" />
              Sortear de novo
            </Button>
          )}
          <Button key="close" variant="ghost" fullWidth onClick={onClose}>
            Fechar
          </Button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
