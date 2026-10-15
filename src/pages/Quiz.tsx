import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronLeft, MapPin, Sparkles } from 'lucide-react'
import { Button } from '../components/Button'
import { Chip } from '../components/Chip'
import { capitalizeLabel } from '../components/labels'
import { ProgressBar } from '../components/ProgressBar'
import { ScreenLayout } from '../components/ScreenLayout'
import { restaurantes } from '../data'
import { listCategories, listNeighborhoods } from '../lib/recomendacao'
import type { AmbiencePreference, Occasion, PriceLevel, QuizAnswers } from '../types'

const TOTAL_STEPS = 5
type Step = 1 | 2 | 3 | 4 | 5

const QUESTIONS: Record<Step, string> = {
  1: 'O que vocês NÃO querem comer hoje?',
  2: 'Quanto pretendem gastar por pessoa?',
  3: 'Onde vocês estão?',
  4: 'Qual é a ocasião?',
  5: 'Que tipo de lugar?',
}

const HINTS: Record<Step, string> = {
  1: 'Toque no que ninguém topa. Se deixar tudo vazio, a gente entende que vocês comem de tudo.',
  2: 'Sem julgamento — é só pra ninguém passar aperto no fim da conta.',
  3: 'Assim a gente procura o que fica pertinho de vocês.',
  4: 'Ajuda a acertar o climinha do lugar.',
  5: 'Última: que tipo de lugar combina com hoje?',
}

/** Estado em construção do questionário: campos ainda sem resposta ficam nulos. */
interface QuizDraft {
  excludedCategories: string[]
  maxPrice: PriceLevel | null
  location: QuizAnswers['location'] | null
  occasion: Occasion | null
  ambience: AmbiencePreference | null
}

const EMPTY_DRAFT: QuizDraft = {
  excludedCategories: [],
  maxPrice: null,
  location: null,
  occasion: null,
  ambience: null,
}

/** Só dá pra avançar quando a pergunta está respondida (a 1 pode ficar vazia). */
const VALIDATORS: Record<Step, (draft: QuizDraft) => boolean> = {
  1: () => true,
  2: (draft) => draft.maxPrice !== null,
  3: (draft) => draft.location !== null,
  4: (draft) => draft.occasion !== null,
  5: (draft) => draft.ambience !== null,
}

interface PriceOption {
  value: PriceLevel
  symbol: string
  label: string
  hint: string
}

const PRICE_OPTIONS: PriceOption[] = [
  { value: 1, symbol: '$', label: 'Baratinho', hint: 'Lanche, tapioca ou uma boa marmita' },
  { value: 2, symbol: '$$', label: 'Na média', hint: 'Prato do dia com sobremesa' },
  { value: 3, symbol: '$$$', label: 'Caprichado', hint: 'Pra sentar, pedir entrada e ficar' },
  { value: 4, symbol: '$$$$', label: 'Sem moderação', hint: 'Dá pra celebrar à vontade' },
]

interface OccasionOption {
  value: Occasion
  label: string
  hint: string
}

const OCCASION_OPTIONS: OccasionOption[] = [
  { value: 'dia comum', label: 'Dia comum', hint: 'Almoço de sempre, sem cerimônia' },
  { value: 'encontro', label: 'Encontro', hint: 'Dois, no clima certo' },
  { value: 'comemoração', label: 'Comemoração', hint: 'Tem motivo pra brindar' },
  { value: 'rápido', label: 'Rápido', hint: 'Fome apertada, pé na porta' },
]

interface AmbienceOption {
  value: AmbiencePreference
  label: string
  hint: string
}

const AMBIENCE_OPTIONS: AmbienceOption[] = [
  { value: 'casual', label: 'Casual', hint: 'Sem etiqueta, conversa solta' },
  { value: 'romântico', label: 'Romântico', hint: 'Luz baixa e mesa a dois' },
  { value: 'ao ar livre', label: 'Ao ar livre', hint: 'Brisa, calçada ou quintal' },
  { value: 'tanto faz', label: 'Tanto faz', hint: 'O que vier tá ótimo' },
]

const TITLE_ID = 'quiz-question'
const HINT_ID = 'quiz-hint'

const OPTION_CLASSES =
  'flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 border-sand-500 bg-white p-4 ' +
  'transition-colors duration-150 ease-out hover:border-caju-500 hover:bg-caju-50 ' +
  'has-[:checked]:border-caju-600 has-[:checked]:bg-caju-50'

const RADIO_CLASSES =
  'size-5 shrink-0 accent-caju-600 focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-caju-700'

function messageForGeoError(error: GeolocationPositionError | null): string {
  if (error?.code === 1) {
    return 'Você não liberou a localização. Sem crise: escolha seu bairro na lista abaixo.'
  }
  if (error?.code === 3) {
    return 'A localização demorou pra responder. Tenta de novo ou escolha seu bairro na lista.'
  }
  return 'Não conseguimos pegar sua localização agora. Escolha seu bairro na lista abaixo.'
}

function toAnswers(draft: QuizDraft): QuizAnswers | null {
  if (
    draft.maxPrice === null ||
    draft.location === null ||
    draft.occasion === null ||
    draft.ambience === null
  ) {
    return null
  }
  return {
    excludedCategories: draft.excludedCategories,
    maxPrice: draft.maxPrice,
    location: draft.location,
    occasion: draft.occasion,
    ambience: draft.ambience,
  }
}

export interface QuizProps {
  /** Chamado ao responder a última pergunta, já com o objeto final. */
  onFinish: (answers: QuizAnswers) => void
  /** Chamado pelo botão Voltar na primeira pergunta. */
  onBack: () => void
}

export function Quiz({ onFinish, onBack }: QuizProps) {
  const [step, setStep] = useState<Step>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [draft, setDraft] = useState<QuizDraft>(EMPTY_DRAFT)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [geoError, setGeoError] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const categories = useMemo(() => listCategories(restaurantes), [])
  const neighborhoods = useMemo(() => listNeighborhoods(restaurantes), [])

  // Acessibilidade: quando o título da pergunta monta (a cada troca), o foco vai pra ele.
  // Ref de callback com identidade estável: roda no mount, não a cada re-render.
  const focusHeading = useCallback((node: HTMLHeadingElement | null) => {
    node?.focus()
  }, [])

  const canAdvance = VALIDATORS[step](draft)
  const question = QUESTIONS[step]
  const hasCoords = draft.location !== null && 'coords' in draft.location
  const selectedNeighborhood =
    draft.location !== null && 'bairro' in draft.location ? draft.location.bairro : ''

  function goToStep(next: number) {
    setStep(Math.min(Math.max(next, 1), TOTAL_STEPS) as Step)
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setDirection(1)
      goToStep(step + 1)
      return
    }
    const answers = toAnswers(draft)
    if (answers) onFinish(answers)
  }

  function handleBack() {
    if (step === 1) {
      onBack()
      return
    }
    setDirection(-1)
    goToStep(step - 1)
  }

  function toggleCategory(category: string) {
    setDraft((current) => ({
      ...current,
      excludedCategories: current.excludedCategories.includes(category)
        ? current.excludedCategories.filter((item) => item !== category)
        : [...current.excludedCategories, category],
    }))
  }

  function chooseNeighborhood(bairro: string) {
    setGeoStatus('idle')
    setGeoError(null)
    setDraft((current) => ({
      ...current,
      location: bairro === '' ? null : { bairro },
    }))
  }

  function requestLocation() {
    if (!('geolocation' in navigator)) {
      setGeoStatus('error')
      setGeoError('Seu navegador não deixa usar a localização. Escolha o bairro na lista abaixo.')
      return
    }
    setGeoStatus('loading')
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoStatus('idle')
        setDraft((current) => ({
          ...current,
          location: {
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
        }))
      },
      (error) => {
        setGeoStatus('error')
        setGeoError(messageForGeoError(error))
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  const offset = reduceMotion ? 0 : 24

  return (
    <ScreenLayout>
      <ProgressBar current={step} total={TOTAL_STEPS} label="Decidindo o rolê" showCount />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ x: offset * dir, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (dir: number) => ({ x: offset * -dir, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <h2 ref={focusHeading} id={TITLE_ID} tabIndex={-1} className="text-2xl text-ink">
              {question}
            </h2>
            <p id={HINT_ID} className="text-sm text-ink-soft">
              {HINTS[step]}
            </p>
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-3">
              <div
                role="group"
                aria-labelledby={TITLE_ID}
                aria-describedby={HINT_ID}
                className="flex flex-wrap gap-2"
              >
                {categories.map((category) => (
                  <Chip
                    key={category}
                    selected={draft.excludedCategories.includes(category)}
                    onClick={() => toggleCategory(category)}
                  >
                    {capitalizeLabel(category)}
                  </Chip>
                ))}
              </div>
              <p className="text-sm text-ink-soft" aria-live="polite">
                {draft.excludedCategories.length === 0
                  ? 'Nada marcado: vocês comem de tudo.'
                  : `Fora da lista: ${draft.excludedCategories.join(', ')}.`}
              </p>
            </div>
          )}

          {step === 2 && (
            <div
              role="radiogroup"
              aria-labelledby={TITLE_ID}
              aria-describedby={HINT_ID}
              className="flex flex-col gap-2"
            >
              {PRICE_OPTIONS.map((option) => (
                <label key={option.value} className={OPTION_CLASSES}>
                  <input
                    type="radio"
                    name="faixa-de-preco"
                    value={option.value}
                    checked={draft.maxPrice === option.value}
                    onChange={() =>
                      setDraft((current) => ({ ...current, maxPrice: option.value }))
                    }
                    className={RADIO_CLASSES}
                  />
                  <span className="flex flex-col">
                    <span className="font-display text-base font-semibold text-ink">
                      {option.symbol} {option.label}
                    </span>
                    <span className="text-sm text-ink-soft">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Button
                  variant={hasCoords ? 'ghost' : 'primary'}
                  fullWidth
                  loading={geoStatus === 'loading'}
                  onClick={requestLocation}
                >
                  <MapPin aria-hidden="true" className="size-5" />
                  {geoStatus === 'loading'
                    ? 'Buscando você...'
                    : hasCoords
                      ? 'Atualizar minha localização'
                      : 'Usar minha localização'}
                </Button>
                {hasCoords && (
                  <p className="flex items-center gap-2 text-sm font-semibold text-mar-700">
                    <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
                    Localização capturada: vamos procurar pertinho de você.
                  </p>
                )}
                {geoStatus === 'error' && geoError && (
                  <p role="alert" className="text-sm font-semibold text-erro-700">
                    {geoError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-ink-soft">
                <span aria-hidden="true" className="h-px flex-1 bg-sand-300" />
                ou
                <span aria-hidden="true" className="h-px flex-1 bg-sand-300" />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quiz-bairro"
                  className="font-display text-sm font-semibold text-ink"
                >
                  Escolha seu bairro
                </label>
                <select
                  id="quiz-bairro"
                  aria-describedby={HINT_ID}
                  value={selectedNeighborhood}
                  onChange={(event) => chooseNeighborhood(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border-2 border-sand-500 bg-white px-4 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caju-700"
                >
                  <option value="">Selecione o bairro</option>
                  {neighborhoods.map((bairro) => (
                    <option key={bairro} value={bairro}>
                      {bairro}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div
              role="radiogroup"
              aria-labelledby={TITLE_ID}
              aria-describedby={HINT_ID}
              className="flex flex-col gap-2"
            >
              {OCCASION_OPTIONS.map((option) => (
                <label key={option.value} className={OPTION_CLASSES}>
                  <input
                    type="radio"
                    name="ocasiao"
                    value={option.value}
                    checked={draft.occasion === option.value}
                    onChange={() => setDraft((current) => ({ ...current, occasion: option.value }))}
                    className={RADIO_CLASSES}
                  />
                  <span className="flex flex-col">
                    <span className="font-display text-base font-semibold text-ink">
                      {option.label}
                    </span>
                    <span className="text-sm text-ink-soft">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {step === 5 && (
            <div
              role="radiogroup"
              aria-labelledby={TITLE_ID}
              aria-describedby={HINT_ID}
              className="flex flex-col gap-2"
            >
              {AMBIENCE_OPTIONS.map((option) => (
                <label key={option.value} className={OPTION_CLASSES}>
                  <input
                    type="radio"
                    name="tipo-de-lugar"
                    value={option.value}
                    checked={draft.ambience === option.value}
                    onChange={() => setDraft((current) => ({ ...current, ambience: option.value }))}
                    className={RADIO_CLASSES}
                  />
                  <span className="flex flex-col">
                    <span className="font-display text-base font-semibold text-ink">
                      {option.label}
                    </span>
                    <span className="text-sm text-ink-soft">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-auto flex items-center gap-3 pt-2">
        <Button variant="ghost" onClick={handleBack} className="shrink-0">
          <ChevronLeft aria-hidden="true" className="size-5" />
          Voltar
        </Button>
        <Button fullWidth disabled={!canAdvance} onClick={handleNext}>
          {step === TOTAL_STEPS ? (
            <>
              <Sparkles aria-hidden="true" className="size-5" />
              Ver o resultado
            </>
          ) : (
            <>
              Próximo
              <ArrowRight aria-hidden="true" className="size-5" />
            </>
          )}
        </Button>
      </div>
    </ScreenLayout>
  )
}
