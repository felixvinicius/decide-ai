import { useCallback, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, Dices, ExternalLink, MapPin, RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { LinkButton } from '../components/LinkButton'
import { Roleta } from '../components/Roleta'
import { ScreenLayout } from '../components/ScreenLayout'
import { Tag } from '../components/Tag'
import { capitalizeLabel } from '../components/labels'
import { googleMapsUrl } from '../components/maps'
import { DishIllustration } from '../components/pratos/DishIllustration'
import { restaurantes } from '../data'
import { recomendar } from '../lib/recomendacao'
import type { ScoredRestaurant } from '../lib/recomendacao'
import type { PriceLevel, QuizAnswers } from '../types'

export interface ResultsProps {
  answers: QuizAnswers
  /** Volta para a tela inicial para responder de novo. */
  onRestart: () => void
}

const PRICE_SYMBOLS: Record<PriceLevel, string> = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' }

/** Título da lista, no singular quando só tem um lugar. */
function resultsTitle(total: number): string {
  if (total === 0) return 'Não achamos nada com esse combo'
  if (total === 1) return 'Achamos 1 lugar pra vocês'
  return `Achamos ${total} lugares pra vocês`
}

/**
 * Distância em linha reta, sempre aproximada: "~700 m" de perto, "~1,8 km" no
 * meio e "~12 km" de longe. Sem distância conhecida, não mostra nada.
 */
function formatDistance(distanciaKm: number | null): string | null {
  if (distanciaKm === null || !Number.isFinite(distanciaKm)) return null
  if (distanciaKm < 1) {
    const metros = Math.max(50, Math.round((distanciaKm * 1000) / 50) * 50)
    return `~${metros} m`
  }
  if (distanciaKm <= 10) return `~${distanciaKm.toFixed(1).replace('.', ',')} km`
  return `~${Math.round(distanciaKm)} km`
}

function RestaurantCard({ item }: { item: ScoredRestaurant }) {
  const { restaurante, distanciaKm, abertoAgora } = item
  const prato = restaurante.pratosSugeridos[0]
  const distancia = formatDistance(distanciaKm)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <DishIllustration
          prato={prato ?? 'Prato do dia'}
          categorias={restaurante.categorias}
          decorative
          className="size-24 shrink-0"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-display text-lg leading-snug font-semibold break-words text-ink">
            {restaurante.nome}
          </h2>
          {prato && <p className="text-sm text-ink-soft">Prato sugerido: {prato}</p>}
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {restaurante.bairro}
            </span>
            {distancia && <span>{distancia} de você</span>}
          </p>
        </div>
      </div>

      {/* Preço, status e categorias na mesma linha: vão quebrando conforme caibam. */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Os $ são um símbolo: pro leitor de tela vale o rótulo com o número. */}
        <Tag role="img" aria-label={`Faixa de preço: ${restaurante.faixaPreco} de 4`}>
          {PRICE_SYMBOLS[restaurante.faixaPreco]}
        </Tag>
        {abertoAgora !== null && (
          <Tag tone={abertoAgora ? 'success' : 'muted'}>
            {abertoAgora ? 'Aberto agora' : 'Fechado agora'}
          </Tag>
        )}
        {restaurante.categorias.map((categoria) => (
          <Tag key={categoria}>{capitalizeLabel(categoria)}</Tag>
        ))}
      </div>

      <LinkButton
        className="mt-auto"
        variant="secondary"
        fullWidth
        href={googleMapsUrl(restaurante)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir no Google Maps: ${restaurante.nome} (abre em nova aba)`}
      >
        <ExternalLink aria-hidden="true" className="size-5 shrink-0" />
        Abrir no Google Maps
      </LinkButton>
    </Card>
  )
}

export function Results({ answers, onRestart }: ResultsProps) {
  const reduceMotion = useReducedMotion()
  // Uma recomendação por montagem (e por mudança de respostas).
  const result = useMemo(() => recomendar(answers, restaurantes), [answers])
  const total = result.itens.length
  const [roletaAberta, setRoletaAberta] = useState(false)

  // O foco vai pro título quando a tela abre (leitor de tela e teclado).
  const focusHeading = useCallback((node: HTMLHeadingElement | null) => {
    node?.focus()
  }, [])

  return (
    <ScreenLayout width="wide">
      <header className="flex flex-col gap-3">
        <h1 ref={focusHeading} tabIndex={-1} className="text-3xl text-ink">
          {resultsTitle(total)}
        </h1>
        <p className="text-ink-soft">
          {total === 0
            ? 'Tenta afrouxar uma resposta — preço, bairro ou ocasião — que a gente procura de novo.'
            : 'Escolham o favorito, confiram os detalhes e bom apetite.'}
        </p>
        {/* Só faz sentido sortear quando existe mais de uma opção. */}
        {total >= 2 && (
          <Button fullWidth aria-haspopup="dialog" onClick={() => setRoletaAberta(true)}>
            <Dices aria-hidden="true" className="size-5 shrink-0" />
            Decide por mim
          </Button>
        )}
      </header>

      {result.avisos.length > 0 && (
        <Card tone="warning" role="status" className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
            <AlertTriangle aria-hidden="true" className="size-5 shrink-0 text-caju-700" />
            Fica de olho
          </h2>
          <ul className="flex flex-col gap-1.5 text-sm text-ink-soft">
            {result.avisos.map((aviso) => (
              <li key={aviso}>{aviso}</li>
            ))}
          </ul>
        </Card>
      )}

      {total > 0 && (
        <ol className="grid gap-4 sm:grid-cols-2">
          {result.itens.map((item, index) => (
            <motion.li
              key={item.restaurante.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.25,
                delay: reduceMotion ? 0 : Math.min(index * 0.05, 0.3),
                ease: 'easeOut',
              }}
            >
              <RestaurantCard item={item} />
            </motion.li>
          ))}
        </ol>
      )}

      <footer className={clsx('flex flex-col gap-3 pt-2', total > 0 && 'mt-auto')}>
        <Button
          variant={total === 0 ? 'primary' : 'secondary'}
          size={total === 0 ? 'lg' : 'md'}
          fullWidth
          onClick={onRestart}
        >
          <RotateCcw aria-hidden="true" className="size-5 shrink-0" />
          Refazer
        </Button>
        <p className="text-center text-xs text-ink-soft">
          Horários, preços e endereços podem ter mudado. Confira antes de sair.
        </p>
      </footer>

      {roletaAberta && (
        <Roleta itens={result.itens} onClose={() => setRoletaAberta(false)} />
      )}
    </ScreenLayout>
  )
}
