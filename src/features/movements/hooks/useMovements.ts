import { useMemo, useState, useEffect, useCallback } from 'react'
import { useProductStore } from '@/store/useProductStore'
import { productsService } from '@/services/products'
import type { Movement, MovementType, MovementSortBy, SortOrder } from '@/types'

const PAGE_SIZE = 10

export function useMovements(productId: string) {
  const productQuantity = useProductStore(
    (s) => s.products.find((p) => p.id === productId)?.quantity ?? 0,
  )

  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const [from, setFrom] = useState(thirtyDaysAgo.toISOString().slice(0, 10))
  const [to, setTo] = useState(today.toISOString().slice(0, 10))
  const [type, setType] = useState<MovementType | 'all'>('all')
  const [accountId, setAccountId] = useState<string>('all')
  const [sortBy, setSortBy] = useState<MovementSortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [page, setPage] = useState(1)
  const [movements, setMovements] = useState<Movement[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  function handleFilterChange<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setPage(1)
    }
  }

  function handleSort(field: MovementSortBy) {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setPage(1)
  }

  const fetchMovements = useCallback(async () => {
    const result = await productsService.getMovements(productId, {
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
      type: type !== 'all' ? type : undefined,
      accountId: accountId !== 'all' ? accountId : undefined,
      sortBy,
      sortOrder,
      page,
      pageSize: PAGE_SIZE,
    })
    setMovements(result.items)
    setTotal(result.total)
    setTotalPages(result.totalPages)
  }, [productId, from, to, type, accountId, sortBy, sortOrder, page])

  useEffect(() => {
    fetchMovements()
  }, [fetchMovements])

  // Compute resulting stock quantity for movements on the current page.
  // Walking newest→oldest from the current product quantity.
  const resultingQuantities = useMemo(() => {
    const map: Record<string, number> = {}
    let running = productQuantity
    for (const mov of movements) {
      map[mov.id] = running
      if (mov.type === 'entry') running -= mov.quantity
      else running += mov.quantity
    }
    return map
  }, [movements, productQuantity])

  return {
    movements,
    resultingQuantities,
    total,
    page,
    setPage,
    totalPages,
    sortBy,
    sortOrder,
    handleSort,
    from,
    setFrom: handleFilterChange(setFrom),
    to,
    setTo: handleFilterChange(setTo),
    type,
    setType: handleFilterChange<MovementType | 'all'>(setType),
    accountId,
    setAccountId: handleFilterChange(setAccountId),
  }
}
