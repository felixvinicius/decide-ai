import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '../components/Button'
import { ScreenLayout } from '../components/ScreenLayout'

export interface HomeProps {
  /** Vai para o questionário. */
  onStart: () => void
}

/** Sol nascendo sobre o mar: a cara de Fortaleza em traço grosso e cores chapadas. */
function SunOverSea() {
  return (
    <svg
      viewBox="0 0 240 150"
      className="h-36 w-full"
      role="img"
      aria-label="Ilustração de um sol nascendo sobre o mar"
    >
      <circle cx="120" cy="62" r="26" className="fill-sol-400 stroke-ink" strokeWidth={4} />
      <g className="stroke-sol-500" strokeWidth={4} strokeLinecap="round">
        <line x1="120" y1="28" x2="120" y2="16" />
        <line x1="86" y1="62" x2="74" y2="62" />
        <line x1="154" y1="62" x2="166" y2="62" />
        <line x1="96" y1="38" x2="88" y2="30" />
        <line x1="144" y1="38" x2="152" y2="30" />
      </g>
      <path
        d="M14 104c13-11 26-11 39 0s26 11 39 0 26-11 39 0 26 11 39 0 26-11 39 0"
        className="fill-mar-100 stroke-mar-500"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d="M30 130c11-9 22-9 33 0s22 9 33 0 22-9 33 0 22 9 33 0 22-9 33 0"
        className="fill-none stroke-mar-300"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Home({ onStart }: HomeProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <ScreenLayout>
      <div className="flex flex-1 flex-col justify-center gap-6">
        <SunOverSea />

        <div className="flex flex-col gap-3">
          <h1 ref={headingRef} tabIndex={-1} className="text-5xl text-ink">
            Decide Aí
          </h1>
          <p className="text-lg text-ink-soft">
            Cansou do “não sei, você escolhe”? Responda cinco perguntinhas e a gente acha o lugar
            certo pra comer em Fortaleza.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" fullWidth onClick={onStart}>
            <Sparkles aria-hidden="true" className="size-5" />
            Bora decidir
          </Button>
          <p className="text-center text-sm text-ink-soft">
            Leva menos de um minuto. Sem cadastro e sem enrolação.
          </p>
        </div>
      </div>
    </ScreenLayout>
  )
}
