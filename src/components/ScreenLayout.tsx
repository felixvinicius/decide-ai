import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface ScreenLayoutProps {
  children: ReactNode
  /** Coluna estreita (padrão) ou `wide` para telas de resultado/desktop. */
  width?: 'narrow' | 'wide'
  className?: string
}

/**
 * Casca de tela: fundo creme, coluna centralizada de no máximo `max-w-md`
 * no desktop, padding seguro e altura mínima da tela.
 */
export function ScreenLayout({ children, width = 'narrow', className }: ScreenLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-cream text-ink">
      <main
        className={clsx(
          'flex min-h-dvh w-full flex-col gap-5 px-5 pt-safe pb-safe',
          width === 'narrow' ? 'max-w-md' : 'max-w-2xl',
          className,
        )}
      >
        {children}
      </main>
    </div>
  )
}
