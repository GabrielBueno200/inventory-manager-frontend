import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '@/store/useProductStore'
import { productSchema, type ProductFormValues } from '../schemas'
import type { Product } from '@/types'

export function useProductForm(product?: Product) {
  const addProduct = useProductStore((s) => s.addProduct)
  const updateProduct = useProductStore((s) => s.updateProduct)
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

  function handleSubmit(values: ProductFormValues) {
    if (product) {
      updateProduct(product.id, values)
    } else {
      addProduct({ ...values, quantity: 0, description: values.description ?? '' })
    }
    navigate('/products')
  }

  function handleRemove() {
    if (product) {
      removeProduct(product.id)
      navigate('/products')
    }
  }

  return { form, handleSubmit: form.handleSubmit(handleSubmit), handleRemove }
}
