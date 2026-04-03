import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Pencil, LogIn, LogOut, History, Trash2 } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StockBadge } from './StockBadge'
import { getStockState, stockStateLabels, formatDate } from '@/utils/stock'
import { useParameterStore } from '@/store/useParameterStore'
import { useProductStore } from '@/store/useProductStore'
import { EntryModal } from '@/features/movements/components/EntryModal'
import { ExitModal } from '@/features/movements/components/ExitModal'
import type { Product } from '@/types'

interface ProductDetailsModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailsModal({ product, open, onOpenChange }: ProductDetailsModalProps) {
  const navigate = useNavigate()
  const thresholds = useParameterStore((s) => s.thresholds)
  const getStateConfig = useParameterStore((s) => s.getStateConfig)
  const removeProduct = useProductStore((s) => s.removeProduct)
  const [entryOpen, setEntryOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false)

  if (!product) return null

  const state = getStockState(product.quantity, thresholds)
  const { color } = getStateConfig(state)

  function handleEdit() {
    onOpenChange(false)
    navigate(`/products/${product!.id}`)
  }

  function handleMovements() {
    onOpenChange(false)
    navigate(`/products/${product!.id}?tab=movements`)
  }

  function handleEntry() {
    onOpenChange(false)
    setEntryOpen(true)
  }

  function handleExit() {
    onOpenChange(false)
    setExitOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} title={product.name} maxWidth="max-w-xl">
        <div className="flex gap-4 mb-4">
          <div className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain rounded-lg" />
            ) : (
              <Package size={40} className="text-gray-300" />
            )}
          </div>
          <div className="flex flex-col gap-1.5 justify-center">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Em estoque:</span>
              <StockBadge quantity={product.quantity} />
              <span className="text-sm font-medium" style={{ color }}>
                ({stockStateLabels[state]})
              </span>
            </div>
            {product.lastEntryAt && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Última entrada:</span>{' '}
                {formatDate(product.lastEntryAt)}
              </p>
            )}
            {product.lastExitAt && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Última baixa:</span>{' '}
                {formatDate(product.lastExitAt)}
              </p>
            )}
          </div>
        </div>

        {product.description && (
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-1">Descrição:</p>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
              {product.description}
            </p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleEntry}>
              <LogIn size={15} />
              Dar entrada
            </Button>
            <Button variant="danger" onClick={handleExit}>
              <LogOut size={15} />
              Dar baixa
            </Button>
            <Button variant="secondary" onClick={handleMovements}>
              <History size={15} />
              Ver movimentações
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="edit" onClick={handleEdit}>
              <Pencil size={15} />
              Editar
            </Button>
            <Button variant="danger" onClick={() => setConfirmRemoveOpen(true)}>
              <Trash2 size={15} />
              Remover
            </Button>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        open={confirmRemoveOpen}
        onOpenChange={setConfirmRemoveOpen}
        title="Remover produto"
        description={`Tem certeza que deseja remover "${product.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Remover"
        onConfirm={() => {
          removeProduct(product.id)
          onOpenChange(false)
          navigate('/products')
        }}
      />
      <EntryModal productId={product.id} open={entryOpen} onOpenChange={setEntryOpen} />
      <ExitModal productId={product.id} open={exitOpen} onOpenChange={setExitOpen} />
    </>
  )
}
