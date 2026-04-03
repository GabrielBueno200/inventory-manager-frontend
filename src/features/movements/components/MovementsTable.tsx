import { ChevronUp, ChevronDown } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { useAccountStore } from '@/store/useAccountStore'
import { formatDate } from '@/utils/stock'
import { useMovements } from '../hooks/useMovements'
import type { MovementSortBy, MovementType, SortOrder } from '@/types'

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'entry', label: 'Entrada' },
  { value: 'exit', label: 'Baixa' },
]

interface MovementsTableProps {
  productId: string
}

interface SortIndicatorProps {
  field: MovementSortBy
  activeSortBy: MovementSortBy
  sortOrder: SortOrder
}

function SortIndicator({ field, activeSortBy, sortOrder }: SortIndicatorProps) {
  if (activeSortBy !== field) return <ChevronUp size={13} className="opacity-25" />
  return sortOrder === 'asc'
    ? <ChevronUp size={13} />
    : <ChevronDown size={13} />
}

export function MovementsTable({ productId }: MovementsTableProps) {
  const {
    movements, resultingQuantities,
    total, page, setPage, totalPages,
    sortBy, sortOrder, handleSort,
    from, setFrom, to, setTo, type, setType, accountId, setAccountId,
  } = useMovements(productId)
  const accounts = useAccountStore((s) => s.accounts)

  const accountOptions = [
    { value: 'all', label: 'Todas as contas' },
    ...accounts.map((a) => ({ value: a.id, label: a.name })),
  ]

  function getAccountName(id: string) {
    if (id === 'manual') return '—'
    return accounts.find((a) => a.id === id)?.name ?? id
  }

  function sortableHeader(label: string, field: MovementSortBy) {
    return (
      <th
        className="px-4 py-3 text-center font-semibold cursor-pointer select-none hover:bg-gray-200 transition-colors"
        onClick={() => handleSort(field)}
      >
        <span className="inline-flex items-center justify-center gap-1">
          {label}
          <SortIndicator field={field} activeSortBy={sortBy} sortOrder={sortOrder} />
        </span>
      </th>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          id="mov-from"
          label="Data início"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input
          id="mov-to"
          label="Data fim"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <Select
          label="Tipo de movimentação"
          value={type}
          onValueChange={(v) => setType(v as MovementType | 'all')}
          options={TYPE_OPTIONS}
        />
        <Select
          label="Conta"
          value={accountId}
          onValueChange={setAccountId}
          options={accountOptions}
        />
      </div>

      {movements.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-8">
          Nenhuma movimentação encontrada para os filtros selecionados.
        </p>
      ) : (
        <>
          <p className="text-xs text-gray-500 text-right">{total} movimentação{total !== 1 ? 'ões' : ''} encontrada{total !== 1 ? 's' : ''}</p>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {sortableHeader('Data', 'createdAt')}
                  {sortableHeader('Tipo', 'type')}
                  <th className="px-4 py-3 text-center font-semibold">Conta</th>
                  {sortableHeader('Quantidade', 'quantity')}
                  <th className="px-4 py-3 text-center font-semibold">Saldo anterior</th>
                  <th className="px-4 py-3 text-center font-semibold">Saldo atual</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((mov, i) => {
                  const resulting = resultingQuantities[mov.id]
                  const previous = mov.type === 'entry' ? resulting - mov.quantity : resulting + mov.quantity
                  return (
                    <tr key={mov.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-center text-gray-600">{formatDate(mov.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={
                            mov.type === 'entry'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {mov.type === 'entry' ? 'ENTRADA' : 'BAIXA'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 text-xs">
                        {getAccountName(mov.accountId)}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-800">
                        {mov.quantity}
                      </td>
                      <td className={`px-4 py-3 text-center font-semibold ${previous < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {previous ?? '—'}
                      </td>
                      <td className={`px-4 py-3 text-center font-semibold ${resulting < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {resulting ?? '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
