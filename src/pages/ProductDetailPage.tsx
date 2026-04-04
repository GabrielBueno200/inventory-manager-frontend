import { useState, useEffect } from 'react'
import { useParams, Navigate, useSearchParams, useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProductForm } from '@/features/products/components/ProductForm'
import { MovementsTable } from '@/features/movements/components/MovementsTable'
import { EntryModal } from '@/features/movements/components/EntryModal'
import { ExitModal } from '@/features/movements/components/ExitModal'
import { useProductForm } from '@/features/products/hooks/useProductForm'
import { useProductStore } from '@/store/useProductStore'
import { productsService } from '@/services/products'
import { clsx } from 'clsx'

type Tab = 'general' | 'movements'

function NewProductPage() {
  const navigate = useNavigate()
  const { form, handleSubmit } = useProductForm()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Novo produto</h1>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ProductForm form={form} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

function ExistingProductPage({ productId }: { productId: string }) {
  const navigate = useNavigate()
  const setProduct = useProductStore((s) => s.setProduct)
  const product = useProductStore((s) => s.products.find((p) => p.id === productId))
  const [notFound, setNotFound] = useState(false)
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>(searchParams.get('tab') === 'movements' ? 'movements' : 'general')
  const [entryOpen, setEntryOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [movementsRefreshKey, setMovementsRefreshKey] = useState(0)

  function handleMovementSaved() {
    setMovementsRefreshKey((k) => k + 1)
  }
  const { form, handleSubmit, handleRemove } = useProductForm(product)

  useEffect(() => {
    if (!product) {
      productsService.getById(productId)
        .then(setProduct)
        .catch(() => setNotFound(true))
    }
  }, [productId, product, setProduct])

  if (notFound) return <Navigate to="/products" replace />
  if (!product) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => setEntryOpen(true)}>
            <TrendingUp size={15} />
            Dar entrada
          </Button>
          <Button variant="danger" onClick={() => setExitOpen(true)}>
            <TrendingDown size={15} />
            Dar baixa
          </Button>
        </div>
      </div>

      <div className="flex gap-0 border-b border-gray-200">
        {(['general', 'movements'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-5 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === t
                ? 'border-stone-800 text-stone-900'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            {t === 'general' ? 'Geral' : 'Movimentações'}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {tab === 'general' ? (
          <ProductForm
            form={form}
            onSubmit={handleSubmit}
            onRemove={handleRemove}
            product={product}
          />
        ) : (
          <MovementsTable productId={product.id} refreshTrigger={movementsRefreshKey} />
        )}
      </div>

      <EntryModal productId={product.id} open={entryOpen} onOpenChange={setEntryOpen} onSuccess={handleMovementSaved} />
      <ExitModal productId={product.id} open={exitOpen} onOpenChange={setExitOpen} onSuccess={handleMovementSaved} />
    </div>
  )
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (id === 'new') return <NewProductPage />
  if (!id) return <Navigate to="/products" replace />
  return <ExistingProductPage productId={id} />
}
