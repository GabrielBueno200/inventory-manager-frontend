export type StockState = 'normal' | 'medium' | 'low'

export type MovementType = 'entry' | 'exit'

export type MovementSortBy = 'createdAt' | 'type' | 'quantity'
export type SortOrder = 'asc' | 'desc'

export interface Account {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  imageUrl?: string
  quantity: number
  accountIds: string[]
  lastEntryAt?: string
  lastExitAt?: string
}

export interface Movement {
  id: string
  productId: string
  accountId: string
  type: MovementType
  quantity: number
  createdAt: string
  notes?: string
}

export type StockParameterId = 'param-normal' | 'param-medium' | 'param-low'

export interface StockParameter {
  id: StockParameterId
  name: string
  value: number
  color: string
}
