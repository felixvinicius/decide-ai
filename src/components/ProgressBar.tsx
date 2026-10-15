import clsx from 'clsx'

export interface ProgressBarProps {
  /** Passo atual (começa em 1). */
  current: number
  /** Total de passos. */
  total: number
  /** Rótulo curto do progresso, ex.: "Suas preferências". */
  label?: string
  /** Mostra "1 de 4" ao lado do rótulo. */
  showCount?: boolean
  className?: string
}

export function ProgressBar({
  current,
  total,
  label,
  showCount = false,
  className,
}: ProgressBarProps) {
  const safeTotal = Math.max(0, Math.trunc(total))
  const safeCurrent = Math.min(Math.max(0, Math.trunc(current)), safeTotal)
  const percent = safeTotal === 0 ? 0 : (safeCurrent / safeTotal) * 100
  const stepLabel = `${safeCurrent} de ${safeTotal}`

  return (
    <div className={clsx('flex w-full flex-col gap-2', className)}>
      {(label || showCount) && (
        <div className="flex items-baseline justify-between gap-3">
          {label && (
            <span className="font-display text-sm font-semibold text-ink">{label}</span>
          )}
          {showCount && <span className="text-sm text-ink-soft">{stepLabel}</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeCurrent}
        aria-label={label ?? stepLabel}
        className="h-3 w-full overflow-hidden rounded-full bg-sand-200 ring-1 ring-sand-300/60"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-caju-500 to-caju-600 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
