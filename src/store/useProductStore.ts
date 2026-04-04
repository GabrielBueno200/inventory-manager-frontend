import { create } from 'zustand'
import type { Product } from '@/types'

interface ProductStore {
  products: Product[]
  setProducts: (products: Product[]) => void
  setProduct: (product: Product) => void
  removeProduct: (id: string) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  setProduct: (product) =>
    set((state) => {
      const exists = state.products.some((p) => p.id === product.id)
      return {
        products: exists
          ? state.products.map((p) => (p.id === product.id ? product : p))
          : [...state.products, product],
      }
    }),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}))
