import type { StockState } from '@/types'

export interface StockThresholds {
  normal: number
  medium: number
}

export function getStockState(quantity: number, thresholds: StockThresholds): StockState {
  if (quantity >= thresholds.normal) return 'normal'
  if (quantity >= thresholds.medium) return 'medium'
  return 'low'
}

export const stockStateLabels: Record<StockState, string> = {
  normal: 'Normal',
  medium: 'Médio',
  low: 'Baixo',
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
