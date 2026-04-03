import { create } from 'zustand'
import { mockMovements } from '@/mocks/data'
import type { Movement, MovementType, MovementSortBy, SortOrder } from '@/types'

interface MovementFilters {
  from?: string
  to?: string
  type?: MovementType | 'all'
  accountId?: string
  sortBy?: MovementSortBy
  sortOrder?: SortOrder
}

interface MovementStore {
  movements: Movement[]
  addMovement: (movement: Omit<Movement, 'id' | 'createdAt'>) => Movement
  getProductMovements: (productId: string, filters?: MovementFilters) => Movement[]
}

export const useMovementStore = create<MovementStore>((set, get) => ({
  movements: mockMovements,

  addMovement: (movement) => {
    const newMovement: Movement = {
      ...movement,
      id: `mov-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ movements: [...state.movements, newMovement] }))
    return newMovement
  },

  getProductMovements: (productId, filters) => {
    let result = get().movements.filter((m) => m.productId === productId)

    if (filters?.type && filters.type !== 'all') {
      result = result.filter((m) => m.type === filters.type)
    }
    if (filters?.accountId && filters.accountId !== 'all') {
      result = result.filter((m) => m.accountId === filters.accountId)
    }
    if (filters?.from) {
      const from = new Date(filters.from).getTime()
      result = result.filter((m) => new Date(m.createdAt).getTime() >= from)
    }
    if (filters?.to) {
      const to = new Date(filters.to)
      to.setHours(23, 59, 59, 999)
      result = result.filter((m) => new Date(m.createdAt).getTime() <= to.getTime())
    }

    const sortBy = filters?.sortBy ?? 'createdAt'
    const sortOrder = filters?.sortOrder ?? 'desc'

    return result.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === 'quantity') {
        cmp = a.quantity - b.quantity
      } else if (sortBy === 'type') {
        cmp = a.type.localeCompare(b.type)
      }
      return sortOrder === 'desc' ? -cmp : cmp
    })
  },
}))
