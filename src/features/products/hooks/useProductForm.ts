import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '@/store/useProductStore'
import { productsService } from '@/services/products'
import { productSchema, type ProductFormValues } from '../schemas'
import type { Product } from '@/types'

export function useProductForm(product?: Product) {
  const setProduct = useProductStore((s) => s.setProduct)
  const removeProduct = useProductStore((s) => s.removeProduct)
  const navigate = useNavigate()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          accountIds: product.accountIds,
        }
      : {
          name: '',
          description: '',
          accountIds: [],
        },
  })

  async function handleSubmit(values: ProductFormValues) {
    const data = { ...values, description: values.description ?? '' }
    if (product) {
      const updated = await productsService.update(product.id, data)
      setProduct(updated)
    } else {
      const created = await productsService.create(data)
      setProduct(created)
    }
    navigate('/products')
  }

  async function handleRemove() {
    if (product) {
      await productsService.remove(product.id)
      removeProduct(product.id)
      navigate('/products')
    }
  }

  return { form, handleSubmit: form.handleSubmit(handleSubmit), handleRemove }
}
