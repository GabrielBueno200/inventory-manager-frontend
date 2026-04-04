import { ArrowRight, Save, X, ArrowLeft } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAccountStore } from '@/store/useAccountStore'
import { useParameterStore } from '@/store/useParameterStore'
import { stockStateLabels } from '@/utils/stock'
import { useExitForm } from '../hooks/useExitForm'

interface ExitModalProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ExitModal({ productId, open, onOpenChange, onSuccess }: ExitModalProps) {
  const accounts = useAccountStore((s) => s.accounts)
  const getStateConfig = useParameterStore((s) => s.getStateConfig)

  const { form, preview, handlePreview, handleConfirm, handleBack } = useExitForm(productId, () => {
    onOpenChange(false)
    onSuccess?.()
  })

  const { register, control, formState: { errors } } = form
  const accountOptions = accounts.map((a) => ({ value: a.id, label: a.name }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Dar baixa" maxWidth="max-w-sm">
      {preview ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">Confira o impacto da operação antes de confirmar:</p>

          <div className="flex items-center justify-center gap-3 rounded-lg bg-gray-50 border border-gray-200 p-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Atual</p>
              <p className="text-2xl font-bold text-gray-800">{preview.currentQuantity}</p>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Resultante</p>
              <p
                className="text-2xl font-bold"
                style={{ color: getStateConfig(preview.resultingState).color }}
              >
                {preview.resultingQuantity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Estado resultante:</span>
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: getStateConfig(preview.resultingState).color }}
            >
              {stockStateLabels[preview.resultingState]}
            </span>
          </div>

          {preview.resultingQuantity < 0 && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md p-3 border border-red-200">
              Atenção: este produto ficará com estoque negativo (uso do estoque reserva).
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleBack}>
              <ArrowLeft size={15} />
              Voltar
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              <Save size={15} />
              Confirmar baixa
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePreview} className="flex flex-col gap-4">
          <Controller
            name="accountId"
            control={control}
            render={({ field }) => (
              <Select
                label="Conta"
                value={field.value}
                onValueChange={field.onChange}
                options={accountOptions}
                placeholder="Selecione a conta..."
              />
            )}
          />
          {errors.accountId && (
            <p className="text-xs text-red-600 -mt-2">{errors.accountId.message}</p>
          )}

          <Input
            id="exit-quantity"
            label="Quantidade a ser descontada"
            type="number"
            min={1}
            placeholder="Quantidade"
            {...register('quantity')}
            error={errors.quantity?.message}
          />

          <div className="flex justify-end gap-2">
            <Button type="submit" variant="danger">
              <ArrowRight size={15} />
              Continuar
            </Button>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              <X size={15} />
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
