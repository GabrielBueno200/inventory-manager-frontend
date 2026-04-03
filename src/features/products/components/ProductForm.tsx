import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Trash2, Save, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAccountStore } from '@/store/useAccountStore'
import type { useProductForm } from '../hooks/useProductForm'
import type { Product } from '@/types'

interface ProductFormProps {
  form: ReturnType<typeof useProductForm>['form']
  onSubmit: () => void
  onRemove?: () => void
  product?: Product
}

export function ProductForm({ form, onSubmit, onRemove, product }: ProductFormProps) {
  const navigate = useNavigate()
  const accounts = useAccountStore((s) => s.accounts)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { register, control, formState: { errors } } = form

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Input
        id="name"
        label="Nome"
        placeholder="Nome do produto"
        {...register('name')}
        error={errors.name?.message}
      />

      {product && (
        <Input
          id="quantity"
          label="Em estoque (apenas leitura)"
          value={product.quantity}
          disabled
          readOnly
        />
      )}

      <Textarea
        id="description"
        label="Descrição"
        placeholder="Descrição do produto"
        {...register('description')}
        error={errors.description?.message}
      />

      <Controller
        name="accountIds"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Contas vinculadas</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {accounts.map((account) => {
                const checked = field.value.includes(account.id)
                return (
                  <label
                    key={account.id}
                    className="flex items-center gap-2 cursor-pointer rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      checked={checked}
                      onChange={() => {
                        const newIds = checked
                          ? field.value.filter((id) => id !== account.id)
                          : [...field.value, account.id]
                        field.onChange(newIds)
                      }}
                    />
                    <span className="text-sm text-gray-700">{account.name}</span>
                  </label>
                )
              })}
            </div>
            {errors.accountIds && (
              <p className="text-xs text-red-600">{errors.accountIds.message}</p>
            )}
          </div>
        )}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary">
          <Save size={15} />
          Salvar
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/products')}>
          <X size={15} />
          Cancelar
        </Button>
        {onRemove && (
          <Button type="button" variant="danger" className="ml-auto" onClick={() => setConfirmOpen(true)}>
            <Trash2 size={15} />
            Remover
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover produto"
        description={`Tem certeza que deseja remover "${product?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Remover"
        onConfirm={onRemove ?? (() => {})}
      />
    </form>
  )
}
