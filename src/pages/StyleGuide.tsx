import { useState } from 'react'
import type { ReactNode } from 'react'
import { Compass, Heart, MapPin, Sparkles, UtensilsCrossed } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Chip } from '../components/Chip'
import { ProgressBar } from '../components/ProgressBar'
import { ScreenLayout } from '../components/ScreenLayout'
import { DishIllustration } from '../components/pratos/DishIllustration'
import { pickDish } from '../components/pratos/pickDish'
import type { DishKind } from '../components/pratos/pickDish'

interface DishExample {
  prato: string
  categorias: string[]
}

/** Um exemplo de prato para cada ilustração, na ordem em que o `pickDish` decide. */
const dishExamples: Record<DishKind, DishExample> = {
  crustaceos: { prato: 'Camarão na moranga', categorias: ['frutos do mar'] },
  peixe: { prato: 'Peixada cearense', categorias: ['frutos do mar'] },
  regional: { prato: 'Carne de sol com macaxeira', categorias: ['regional'] },
  churrasco: { prato: 'Picanha na brasa', categorias: ['churrasco'] },
  massa: { prato: 'Parmigiana de berinjela', categorias: ['italiana'] },
  pizza: { prato: 'Pizza de calabresa', categorias: ['pizza'] },
  sushi: { prato: 'Rodízio de sushi', categorias: ['japonesa'] },
  hamburguer: { prato: 'Hambúrguer artesanal', categorias: ['hambúrguer'] },
  tapioca: { prato: 'Tapioca recheada', categorias: ['regional'] },
  doce: { prato: 'Bolo de rolo', categorias: ['doces'] },
  cafe: { prato: 'Café coado com pão', categorias: ['café'] },
  salada: { prato: 'Salada do mar', categorias: ['saudável'] },
  generico: { prato: 'Prato do dia', categorias: [] },
}

const dishKinds = Object.keys(dishExamples) as DishKind[]

interface Swatch {
  name: string
  token: string
  value: string
}

interface PaletteGroup {
  title: string
  description: string
  swatches: Swatch[]
}

const paletteGroups: PaletteGroup[] = [
  {
    title: 'Caju — destaque',
    description: 'Cor principal: botões, seleção e momentos de decisão.',
    swatches: [
      { name: 'caju-50', token: 'bg-caju-50', value: '#fff4ef' },
      { name: 'caju-100', token: 'bg-caju-100', value: '#ffe4d8' },
      { name: 'caju-200', token: 'bg-caju-200', value: '#ffc7b0' },
      { name: 'caju-400', token: 'bg-caju-400', value: '#f87a52' },
      { name: 'caju-600', token: 'bg-caju-600', value: '#c43f1b' },
      { name: 'caju-700', token: 'bg-caju-700', value: '#9e3115' },
      { name: 'caju-800', token: 'bg-caju-800', value: '#7a2610' },
      { name: 'caju-900', token: 'bg-caju-900', value: '#571a0b' },
    ],
  },
  {
    title: 'Mar — secundária',
    description: 'Verde-mar do nosso litoral: apoio, links e estados alternativos.',
    swatches: [
      { name: 'mar-50', token: 'bg-mar-50', value: '#ecf7f4' },
      { name: 'mar-100', token: 'bg-mar-100', value: '#d2ede7' },
      { name: 'mar-200', token: 'bg-mar-200', value: '#a6dbd0' },
      { name: 'mar-400', token: 'bg-mar-400', value: '#40a694' },
      { name: 'mar-600', token: 'bg-mar-600', value: '#146b5c' },
      { name: 'mar-700', token: 'bg-mar-700', value: '#0f5548' },
      { name: 'mar-800', token: 'bg-mar-800', value: '#0a3f36' },
      { name: 'mar-900', token: 'bg-mar-900', value: '#072b25' },
    ],
  },
  {
    title: 'Neutros quentes',
    description: 'Fundo creme, cartões brancos e texto marrom escuro.',
    swatches: [
      { name: 'cream', token: 'bg-cream', value: '#fff8f0' },
      { name: 'sand-100', token: 'bg-sand-100', value: '#fbf0e2' },
      { name: 'sand-200', token: 'bg-sand-200', value: '#f4e5d3' },
      { name: 'sand-300', token: 'bg-sand-300', value: '#e6d0b6' },
      { name: 'sand-400', token: 'bg-sand-400', value: '#cba98a' },
      { name: 'sand-500', token: 'bg-sand-500', value: '#a97f5f' },
      { name: 'ink-soft', token: 'bg-ink-soft', value: '#6b5a4e' },
      { name: 'ink', token: 'bg-ink', value: '#2b1b12' },
    ],
  },
  {
    title: 'Sol e erro',
    description: 'Sol só em detalhes e ilustrações; erro para avisos e validações.',
    swatches: [
      { name: 'sol-100', token: 'bg-sol-100', value: '#fdf1d6' },
      { name: 'sol-400', token: 'bg-sol-400', value: '#f2b33d' },
      { name: 'sol-500', token: 'bg-sol-500', value: '#d9991c' },
      { name: 'erro-100', token: 'bg-erro-100', value: '#fbe4e1' },
      { name: 'erro-600', token: 'bg-erro-600', value: '#a8241c' },
      { name: 'erro-700', token: 'bg-erro-700', value: '#8a1c15' },
    ],
  },
]

const chipOptions = [
  'Nordestina',
  'Peixes e frutos do mar',
  'Pizza',
  'Vegetariana',
  'Docinhos',
  'Barzinho',
]

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl text-ink">{title}</h2>
        {description && <p className="text-sm text-ink-soft">{description}</p>}
      </header>
      {children}
    </section>
  )
}

export function StyleGuide() {
  const [selectedChips, setSelectedChips] = useState<string[]>(['Nordestina', 'Pizza'])

  function toggleChip(option: string) {
    setSelectedChips((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    )
  }

  return (
    <ScreenLayout className="gap-8">
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sol-100 px-3 py-1 text-sm font-semibold text-caju-800">
          <Sparkles aria-hidden="true" className="size-4" />
          Guia de estilo
        </span>
        <h1 className="text-4xl text-ink">Decide Aí</h1>
        <p className="text-ink-soft">
          As peças do visual do app: cores, letras, botões, cartões e as ilustrações dos pratos.
          Abra o endereço com <span className="font-semibold text-ink">/#guia</span> para cair aqui
          direto.
        </p>
      </header>

      <Section
        title="Paleta"
        description="Tokens definidos em @theme no src/index.css. Todo texto passa em contraste AA."
      >
        <div className="flex flex-col gap-5">
          {paletteGroups.map((group) => (
            <Card key={group.title} padding="md" className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-lg font-semibold text-ink">{group.title}</h3>
                <p className="text-sm text-ink-soft">{group.description}</p>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {group.swatches.map((swatch) => (
                  <li key={swatch.name} className="flex flex-col gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`h-14 w-full rounded-2xl border border-ink/10 ${swatch.token}`}
                    />
                    <span className="font-display text-sm font-semibold text-ink">
                      {swatch.name}
                    </span>
                    <span className="text-xs tracking-wide text-ink-soft uppercase">
                      {swatch.value}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Tipografia" description="Baloo 2 nos títulos, Nunito Sans no texto corrido.">
        <Card className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-3xl text-ink">Bora decidir o almoço?</h3>
            <p className="text-sm text-ink-soft">Baloo 2 · 32px · título de tela (h1)</p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl text-ink">Três opções pertinho de você</h3>
            <p className="text-sm text-ink-soft">Baloo 2 · 20px · título de seção (h2)</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base text-ink">
              A gente monta um roteiro de acordo com a sua fome, o seu bolso e o seu humor. Fica
              leve, é só responder cinco perguntinhas.
            </p>
            <p className="text-sm text-ink-soft">Nunito Sans · 16px · corpo do texto</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-ink-soft">
              Abre às 18h · até 12 km de você · faixa de preço média
            </p>
            <p className="text-sm text-ink-soft">Nunito Sans · 14px · texto de apoio (#6b5a4e)</p>
          </div>
        </Card>
      </Section>

      <Section
        title="Botões"
        description="Alvo de toque sempre maior ou igual a 44px, com foco visível e estado desabilitado."
      >
        <Card className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Button variant="primary" fullWidth>
              <Sparkles aria-hidden="true" className="size-5" />
              Decidir por mim
            </Button>
            <Button variant="secondary" fullWidth>
              <Compass aria-hidden="true" className="size-5" />
              Ver todas as opções
            </Button>
            <Button variant="ghost" fullWidth>
              Responder de novo
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="md">Médio (44px)</Button>
            <Button size="lg" variant="secondary">
              Grande (52px)
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Desabilitado</Button>
            <Button loading>Carregando</Button>
            <Button variant="ghost" disabled>
              Ghost off
            </Button>
          </div>
        </Card>
      </Section>

      <Section
        title="Chips"
        description="Seleção múltipla com aria-pressed. Toque para marcar e desmarcar."
      >
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-ink-soft">
            O que você <strong className="font-semibold text-ink">não</strong> quer hoje?
          </p>
          <div className="flex flex-wrap gap-2">
            {chipOptions.map((option) => (
              <Chip
                key={option}
                selected={selectedChips.includes(option)}
                onClick={() => toggleChip(option)}
              >
                {option}
              </Chip>
            ))}
          </div>
          <p className="text-sm text-ink-soft" aria-live="polite">
            {selectedChips.length === 0
              ? 'Nada marcado: a gente mostra tudo.'
              : `Marcado: ${selectedChips.join(', ')}.`}
          </p>
          <div className="flex flex-wrap gap-2">
            <Chip selected disabled>
              Indisponível
            </Chip>
            <Chip disabled>Só exemplo</Chip>
          </div>
        </Card>
      </Section>

      <Section title="Progresso" description="Mostra em que passo do quiz o casal está.">
        <Card className="flex flex-col gap-5">
          <ProgressBar current={1} total={4} label="Suas preferências" showCount />
          <ProgressBar current={3} total={4} label="Quase lá" showCount />
          <ProgressBar current={4} total={4} label="Prontinho" showCount />
        </Card>
      </Section>

      <Section title="Cartões" description="Container padrão para restaurantes e resumos.">
        <div className="flex flex-col gap-4">
          <Card interactive className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Cantina do Caju
                </h3>
                <p className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
                  <MapPin aria-hidden="true" className="size-4 shrink-0" />
                  Meireles · Nordestina
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mar-50 px-3 py-1 text-xs font-semibold text-mar-700">
                <UtensilsCrossed aria-hidden="true" className="size-4 shrink-0" />
                Aberto
              </span>
            </div>
            <p className="text-sm text-ink-soft">
              Camarão na moranga, baião de dois e um bolo de rolo que resolve qualquer
              indecisão.
            </p>
            <div className="flex items-center gap-3">
              <Button size="md">
                <Heart aria-hidden="true" className="size-5" />
                Escolher esse
              </Button>
              <Button variant="ghost" size="md">
                Ver no mapa
              </Button>
            </div>
          </Card>

          <Card padding="sm" tone="warning">
            <p className="px-1 py-1 text-sm text-ink">
              <strong className="font-semibold">Dica:</strong> cartões em creme/sol servem para
              destaques rápidos, sem competir com os botões de caju.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        title="Ilustrações dos pratos"
        description="Um desenho por tipo de prato, no mesmo estilo: contorno grosso em ink, cores chapadas da paleta e viewBox 120x120. O pickDish escolhe o desenho pelo nome do prato e, se não achar, pela categoria."
      >
        <div className="flex flex-col gap-4">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {dishKinds.map((kind) => {
              const exemplo = dishExamples[kind]
              const escolhido = pickDish(exemplo.prato, exemplo.categorias)
              return (
                <li key={kind}>
                  <Card padding="sm" className="flex flex-col items-center gap-1 text-center">
                    <DishIllustration
                      prato={exemplo.prato}
                      categorias={exemplo.categorias}
                      decorative
                      className="h-24 w-24"
                    />
                    <span className="font-display text-sm font-semibold text-ink">{kind}</span>
                    <span className="text-xs text-ink-soft">{exemplo.prato}</span>
                    {escolhido !== kind && (
                      <span className="text-xs font-semibold text-erro-700">
                        pickDish devolveu {escolhido}
                      </span>
                    )}
                  </Card>
                </li>
              )
            })}
          </ul>

          <Card className="flex flex-col gap-3">
            <p className="text-sm text-ink-soft">
              Mesmo desenho em 64px, 96px e 160px: precisa continuar legível de longe e de perto.
            </p>
            <div className="flex flex-wrap items-end gap-4">
              <DishIllustration
                prato="Camarão na moranga"
                categorias={['frutos do mar']}
                className="size-16"
              />
              <DishIllustration
                prato="Camarão na moranga"
                categorias={['frutos do mar']}
                className="size-24"
              />
              <DishIllustration
                prato="Camarão na moranga"
                categorias={['frutos do mar']}
                className="size-40"
              />
              <DishIllustration
                prato="Picanha na brasa"
                categorias={['churrasco']}
                decorative
                className="size-24"
              />
            </div>
            <p className="text-sm text-ink-soft">
              Com <code className="font-semibold text-ink">decorative</code>, a última sai sem
              rótulo (aria-hidden) — use quando o nome do prato já aparece do lado.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Acessibilidade" description="O que já está garantido neste sistema.">
        <Card className="flex flex-col gap-2">
          <ul className="flex flex-col gap-2 text-sm text-ink-soft">
            <li>• Contraste mínimo AA entre texto e fundo em todos os tons usados.</li>
            <li>• Alvos de toque com 44px ou mais e foco sempre visível pelo teclado.</li>
            <li>• Animações curtas e desligadas quando o sistema pede menos movimento.</li>
            <li>• Ícones decorativos com aria-hidden e rótulos em português.</li>
            <li>
              • Ilustrações de prato com role=img e aria-label “Ilustração de …”, ou aria-hidden
              quando são só enfeite.
            </li>
          </ul>
        </Card>
      </Section>

      <footer className="pb-2 text-center text-sm text-ink-soft">
        Decide Aí · Fortaleza-CE · telas do fluxo e ilustrações dos pratos já estão de pé; o
        resto chega nas próximas tarefas.
      </footer>
    </ScreenLayout>
  )
}
