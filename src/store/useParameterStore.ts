import { create } from 'zustand'
import { mockParameters } from '@/mocks/data'
import type { StockParameter, StockParameterId, StockState } from '@/types'
import type { StockThresholds } from '@/utils/stock'

interface ParameterStore {
  parameters: StockParameter[]
  thresholds: StockThresholds
  updateParameter: (id: StockParameterId, data: Partial<Pick<StockParameter, 'value' | 'color'>>) => void
  getStateConfig: (state: StockState) => { color: string; label: string }
}

function computeThresholds(params: StockParameter[]): StockThresholds {
  const normal = params.find((p) => p.id === 'param-normal')?.value ?? 20
  const medium = params.find((p) => p.id === 'param-medium')?.value ?? 10
  return { normal, medium }
}

export const useParameterStore = create<ParameterStore>((set, get) => ({
  parameters: mockParameters,
  thresholds: computeThresholds(mockParameters),

  updateParameter: (id, data) =>
    set((state) => {
      const updated = state.parameters.map((p) => (p.id === id ? { ...p, ...data } : p))
      return { parameters: updated, thresholds: computeThresholds(updated) }
    }),

  getStateConfig: (state: StockState) => {
    const stateToParamId: Record<StockState, StockParameterId> = {
      normal: 'param-normal',
      medium: 'param-medium',
      low: 'param-low',
    }
    const param = get().parameters.find((p) => p.id === stateToParamId[state])
    return { color: param?.color ?? '#6b7280', label: param?.name ?? state }
  },
}))
