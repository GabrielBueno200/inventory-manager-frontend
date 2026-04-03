import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMovementStore } from '@/store/useMovementStore'
import { useProductStore } from '@/store/useProductStore'
import { useParameterStore } from '@/store/useParameterStore'
import { getStockState } from '@/utils/stock'
import { exitSchema, type ExitFormValues } from '../schemas'
import type { StockState } from '@/types'

interface ExitPreview {
  currentQuantity: number
  resultingQuantity: number
  resultingState: StockState
}

export function useExitForm(productId: string, onSuccess: () => void) {
  const addMovement = useMovementStore((s) => s.addMovement)
  const adjustQuantity = useProductStore((s) => s.adjustQuantity)
  const updateProduct = useProductStore((s) => s.updateProduct)
  const product = useProductStore((s) => s.products.find((p) => p.id === productId))
  const thresholds = useParameterStore((s) => s.thresholds)
  const [preview, setPreview] = useState<ExitPreview | null>(null)

  const form = useForm<ExitFormValues>({
    resolver: zodResolver(exitSchema) as Resolver<ExitFormValues>,
    defaultValues: { accountId: '', quantity: 1, notes: '' },
  })

  function buildPreview(values: ExitFormValues): ExitPreview | null {
    if (!product) return null
    const resulting = product.quantity - values.quantity
    return {
      currentQuantity: product.quantity,
      resultingQuantity: resulting,
      resultingState: getStockState(resulting, thresholds),
    }
  }

  function handlePreview(values: ExitFormValues) {
    setPreview(buildPreview(values))
  }

  function handleConfirm(values: ExitFormValues) {
    addMovement({
      productId,
      accountId: values.accountId,
      type: 'exit',
      quantity: values.quantity,
      notes: values.notes,
    })
    adjustQuantity(productId, -values.quantity)
    updateProduct(productId, { lastExitAt: new Date().toISOString() })
    form.reset()
    setPreview(null)
    onSuccess()
  }

  return {
    form,
    preview,
    handlePreview: form.handleSubmit(handlePreview),
    handleConfirm: form.handleSubmit(handleConfirm),
    handleBack: () => setPreview(null),
  }
}
