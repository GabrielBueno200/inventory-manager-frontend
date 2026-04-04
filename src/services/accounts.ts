import { api } from './api'
import type { Account } from '@/types'

export const accountsService = {
  getAll: () => api.get<Account[]>('/accounts').then((r) => r.data),

  create: (data: { name: string }) =>
    api.post<Account>('/accounts', data).then((r) => r.data),

  update: (id: string, data: { name: string }) =>
    api.patch<Account>(`/accounts/${id}`, data).then((r) => r.data),

  remove: (id: string) => api.delete(`/accounts/${id}`),
}
