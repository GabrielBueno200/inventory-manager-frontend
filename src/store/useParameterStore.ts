import { create } from 'zustand'
import type { StockParameter, StockParameterId, StockState } from '@/types'
import type { StockThresholds } from '@/utils/stock'

interface ParameterStore {
  parameters: StockParameter[]
  isLoaded: boolean
  thresholds: StockThresholds
  setParameters: (parameters: StockParameter[]) => void
  updateParameter: (parameter: StockParameter) => void
  getStateConfig: (state: StockState) => { color: string; label: string }
}

function computeThresholds(params: StockParameter[]): StockThresholds {
  const normal = params.find((p) => p.id === 'param-normal')?.value ?? 20
  const medium = params.find((p) => p.id === 'param-medium')?.value ?? 10
  return { normal, medium }
}

export const useParameterStore = create<ParameterStore>((set, get) => ({
  parameters: [],
  isLoaded: false,
  thresholds: { normal: 20, medium: 10 },

  setParameters: (parameters) =>
    set({ parameters, isLoaded: true, thresholds: computeThresholds(parameters) }),

  updateParameter: (parameter) =>
    set((state) => {
      const updated = state.parameters.map((p) =>
        p.id === parameter.id ? parameter : p,
      )
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
