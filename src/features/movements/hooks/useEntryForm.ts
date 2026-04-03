import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMovementStore } from '@/store/useMovementStore'
import { useProductStore } from '@/store/useProductStore'
import { entrySchema, type EntryFormValues } from '../schemas'

export function useEntryForm(productId: string, onSuccess: () => void) {
  const addMovement = useMovementStore((s) => s.addMovement)
  const adjustQuantity = useProductStore((s) => s.adjustQuantity)
  const updateProduct = useProductStore((s) => s.updateProduct)

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema) as Resolver<EntryFormValues>,
    defaultValues: { quantity: 1, notes: '' },
  })

  function handleSubmit(values: EntryFormValues) {
    addMovement({
      productId,
      accountId: 'manual',
      type: 'entry',
      quantity: values.quantity,
      notes: values.notes,
    })
    adjustQuantity(productId, values.quantity)
    updateProduct(productId, { lastEntryAt: new Date().toISOString() })
    form.reset()
    onSuccess()
  }

  return { form, handleSubmit: form.handleSubmit(handleSubmit) }
}
