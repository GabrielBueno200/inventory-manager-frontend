import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { ProductCard } from '@/features/products/components/ProductCard'
import { ProductDetailsModal } from '@/features/products/components/ProductDetailsModal'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { Product, StockState } from '@/types'

const STATE_FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Médio' },
  { value: 'low', label: 'Baixo' },
  { value: 'negative', label: 'Negativo' },
]

export function StockManagementPage() {
  const navigate = useNavigate()
  const {
    products,
    search,
    setSearch,
    stateFilter,
    setStateFilter,
    page,
    setPage,
    totalPages,
  } = useProducts()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  function handleViewDetails(product: Product) {
    setSelectedProduct(product)
    setDetailsOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Estoque</h1>
        <Button variant="primary" onClick={() => navigate('/products/new')}>
          <Plus size={16} />
          Novo produto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          id="search"
          label="Nome do produto"
          placeholder="Digite o nome do produto desejado"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Filtrar por disponibilidade"
          value={stateFilter}
          onValueChange={(v) => setStateFilter(v as StockState | 'all' | 'negative')}
          options={STATE_FILTER_OPTIONS}
        />
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">Nenhum produto encontrado.</p>
          <p className="text-sm mt-1">Ajuste os filtros ou cadastre um novo produto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ProductDetailsModal
        product={selectedProduct}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  )
}
