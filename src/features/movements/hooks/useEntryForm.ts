import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProductStore } from '@/store/useProductStore'
import { productsService } from '@/services/products'
import { entrySchema, type EntryFormValues } from '../schemas'

export function useEntryForm(productId: string, onSuccess: () => void) {
  const setProduct = useProductStore((s) => s.setProduct)

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema) as Resolver<EntryFormValues>,
    defaultValues: { quantity: 1, notes: '' },
  })

  async function handleSubmit(values: EntryFormValues) {
    await productsService.registerEntry(productId, {
      quantity: values.quantity,
      notes: values.notes || null,
    })
    const updated = await productsService.getById(productId)
    setProduct(updated)
    form.reset()
    onSuccess()
  }

  return { form, handleSubmit: form.handleSubmit(handleSubmit) }
}
