import { api } from './api'
import type { Product, Movement } from '@/types'

export interface PagedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ProductsQuery {
  search?: string
  state?: string
  page?: number
  pageSize?: number
}

export interface MovementsQuery {
  from?: string
  to?: string
  type?: string
  accountId?: string
  sortBy?: string
  sortOrder?: string
  page?: number
  pageSize?: number
}

export const productsService = {
  getAll: (params?: ProductsQuery) =>
    api.get<PagedResult<Product>>('/products', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`).then((r) => r.data),

  create: (data: { name: string; description: string; accountIds: string[] }) =>
    api.post<Product>('/products', data).then((r) => r.data),

  update: (id: string, data: { name: string; description: string; accountIds: string[] }) =>
    api.patch<Product>(`/products/${id}`, data).then((r) => r.data),

  remove: (id: string) => api.delete(`/products/${id}`),

  registerEntry: (productId: string, data: { quantity: number; notes?: string | null }) =>
    api.post(`/products/${productId}/entries`, data).then((r) => r.data),

  registerExit: (
    productId: string,
    data: { accountId: string; quantity: number; notes?: string | null },
  ) => api.post(`/products/${productId}/exits`, data).then((r) => r.data),

  getMovements: (productId: string, params?: MovementsQuery) =>
    api
      .get<PagedResult<Movement>>(`/products/${productId}/movements`, { params })
      .then((r) => r.data),
}
