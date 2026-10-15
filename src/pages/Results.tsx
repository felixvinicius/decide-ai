import { useMemo } from 'react'
import { AlertTriangle, RotateCcw, Utensils } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ScreenLayout } from '../components/ScreenLayout'
import { restaurantes } from '../data'
import { recomendar } from '../lib/recomendacao'
import type { QuizAnswers } from '../types'

export interface ResultsProps {
  answers: QuizAnswers
  /** Volta para a tela inicial para responder de novo. */
  onRestart: () => void
}

/**
 * TEMPORÁRIO: só lista os nomes e os avisos da recomendação para conferir o fluxo.
 * A tela de resultados de verdade entra na próxima tarefa.
 */
export function Results({ answers, onRestart }: ResultsProps) {
  const result = useMemo(() => recomendar(answers, restaurantes), [answers])

  return (
    <ScreenLayout>
      <h1 className="text-3xl text-ink">Resultado</h1>
      <p className="text-sm text-ink-soft">
        Rascunho temporário: aqui só aparecem os nomes retornados pela recomendação e os avisos.
      </p>

      <Card className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <Utensils aria-hidden="true" className="size-5 shrink-0 text-caju-600" />
          Lugares sugeridos
        </h2>
        {result.itens.length === 0 ? (
          <p className="text-sm text-ink-soft">Nenhum lugar bateu com as respostas desta vez.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {result.itens.map((item) => (
              <li key={item.restaurante.id} className="text-base text-ink">
                {item.restaurante.nome}
              </li>
            ))}
          </ol>
        )}
      </Card>

      {result.avisos.length > 0 && (
        <Card className="flex flex-col gap-2 bg-sol-100">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <AlertTriangle aria-hidden="true" className="size-5 shrink-0 text-caju-700" />
            Avisos
          </h2>
          <ul className="flex flex-col gap-2">
            {result.avisos.map((aviso) => (
              <li key={aviso} className="text-sm text-ink-soft">
                {aviso}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-auto pt-2">
        <Button variant="secondary" fullWidth onClick={onRestart}>
          <RotateCcw aria-hidden="true" className="size-5" />
          Responder de novo
        </Button>
      </div>
    </ScreenLayout>
  )
}
