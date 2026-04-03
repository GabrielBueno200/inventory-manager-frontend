import { Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StockBadge } from './StockBadge'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-center bg-gray-50 h-36">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <Package size={48} className="text-gray-300" />
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <p className="text-sm font-semibold text-gray-800 text-center line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="w-full text-amber-700 bg-amber-100 hover:bg-amber-200"
          onClick={() => onViewDetails(product)}
        >
          Ver detalhes
        </Button>

        <StockBadge
          quantity={product.quantity}
          className="w-full justify-center"
        />
      </div>
    </div>
  )
}
