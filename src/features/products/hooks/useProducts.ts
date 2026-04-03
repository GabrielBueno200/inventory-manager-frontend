import { useState, useMemo } from 'react'
import { useProductStore } from '@/store/useProductStore'
import { useParameterStore } from '@/store/useParameterStore'
import { getStockState } from '@/utils/stock'
import type { StockState } from '@/types'

export function useProducts() {
  const products = useProductStore((s) => s.products)
  const thresholds = useParameterStore((s) => s.thresholds)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<StockState | 'all' | 'negative'>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      let matchesState: boolean
      if (stateFilter === 'all') {
        matchesState = true
      } else if (stateFilter === 'negative') {
        matchesState = p.quantity < 0
      } else {
        matchesState = getStockState(p.quantity, thresholds) === stateFilter
      }
      return matchesSearch && matchesState
    })
  }, [products, search, stateFilter, thresholds])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return {
    products: paginated,
    search,
    setSearch,
    stateFilter,
    setStateFilter: (v: StockState | 'all' | 'negative') => {
      setStateFilter(v)
      setPage(1)
    },
    page,
    setPage,
    totalPages,
  }
}
