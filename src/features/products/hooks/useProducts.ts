import { useState, useEffect, useCallback } from 'react'
import { useProductStore } from '@/store/useProductStore'
import { productsService } from '@/services/products'
import type { StockState } from '@/types'

export function useProducts() {
  const setProducts = useProductStore((s) => s.setProducts)
  const products = useProductStore((s) => s.products)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<StockState | 'all' | 'negative'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 10

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await productsService.getAll({
        search: search || undefined,
        state: stateFilter !== 'all' ? stateFilter : undefined,
        page,
        pageSize,
      })
      setProducts(result.items)
      setTotalPages(result.totalPages)
    } finally {
      setIsLoading(false)
    }
  }, [search, stateFilter, page, pageSize, setProducts])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    isLoading,
    search,
    setSearch: (v: string) => { setSearch(v); setPage(1) },
    stateFilter,
    setStateFilter: (v: StockState | 'all' | 'negative') => { setStateFilter(v); setPage(1) },
    page,
    setPage,
    totalPages,
    refetch: fetchProducts,
  }
}
