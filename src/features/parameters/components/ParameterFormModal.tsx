import { Save } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { useParameterForm } from '../hooks/useParameterForm'

interface ParameterFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editing: { name: string; value: number; color: string } | null
  form: ReturnType<typeof useParameterForm>['form']
  onSubmit: () => void
}

export function ParameterFormModal({
  isOpen,
  onOpenChange,
  editing,
  form,
  onSubmit,
}: ParameterFormModalProps) {
  const { register, watch, formState: { errors } } = form
  const currentColor = watch('color')

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={editing ? `Editar: ${editing.name}` : 'Editar parâmetro'}
      maxWidth="max-w-sm"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          id="param-value"
          label="Quantidade mínima"
          type="number"
          min={0}
          {...register('value')}
          error={errors.value?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="param-color" className="text-sm font-medium text-gray-700">
            Cor
          </label>
          <div className="flex items-center gap-3">
            <input
              id="param-color"
              type="color"
              className="h-10 w-16 cursor-pointer rounded-md border border-gray-300 p-0.5"
              {...register('color')}
            />
            <span className="text-sm text-gray-500">{currentColor}</span>
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: currentColor }}
            >
              {editing?.name ?? 'Preview'}
            </span>
          </div>
          {errors.color && <p className="text-xs text-red-600">{errors.color.message}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            <Save size={15} />
            Salvar
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
