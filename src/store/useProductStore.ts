import { create } from 'zustand'
import { mockProducts } from '@/mocks/data'
import type { Product } from '@/types'

interface ProductStore {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => void
  removeProduct: (id: string) => void
  adjustQuantity: (id: string, delta: number) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,

  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...product, id: `prod-${Date.now()}` },
      ],
    })),

  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  adjustQuantity: (id, delta) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + delta } : p,
      ),
    })),
}))
