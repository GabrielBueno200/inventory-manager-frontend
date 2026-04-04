import { api } from './api'
import type { StockParameter } from '@/types'

export const parametersService = {
  getAll: () => api.get<StockParameter[]>('/parameters').then((r) => r.data),

  update: (id: string, data: { value?: number | null; color?: string | null }) =>
    api.patch<StockParameter>(`/parameters/${id}`, data).then((r) => r.data),
}
