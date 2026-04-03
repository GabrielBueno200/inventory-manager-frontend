import { clsx } from 'clsx'
import { useParameterStore } from '@/store/useParameterStore'
import { getStockState, stockStateLabels } from '@/utils/stock'

interface StockBadgeProps {
  quantity: number
  showQuantity?: boolean
  className?: string
}

export function StockBadge({ quantity, showQuantity = true, className }: StockBadgeProps) {
  const thresholds = useParameterStore((s) => s.thresholds)
  const getStateConfig = useParameterStore((s) => s.getStateConfig)
  const state = getStockState(quantity, thresholds)
  const { color } = getStateConfig(state)

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold text-white',
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {showQuantity ? `Em estoque: ${quantity}` : stockStateLabels[state]}
    </span>
  )
}
