import { useMemo, useState } from 'react'
import { useMovementStore } from '@/store/useMovementStore'
import { useProductStore } from '@/store/useProductStore'
import type { MovementType, MovementSortBy, SortOrder } from '@/types'

const PAGE_SIZE = 10

export function useMovements(productId: string) {
  const getProductMovements = useMovementStore((s) => s.getProductMovements)
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

  function handleFilterChange<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setPage(1) }
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

  const allFilteredMovements = getProductMovements(productId, { from, to, type, accountId, sortBy, sortOrder })
  const total = allFilteredMovements.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const movements = allFilteredMovements.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Compute resulting stock quantity after each movement.
  // allMovements is always sorted createdAt desc; we walk newest→oldest,
  // starting at the current product quantity and undoing each movement.
  const allMovements = getProductMovements(productId)
  const resultingQuantities = useMemo(() => {
    const map: Record<string, number> = {}
    let running = productQuantity
    for (const mov of allMovements) {
      map[mov.id] = running
      if (mov.type === 'entry') running -= mov.quantity
      else running += mov.quantity
    }
    return map
  }, [allMovements, productQuantity])

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
