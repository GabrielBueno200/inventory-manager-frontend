import { Save, X } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useEntryForm } from '../hooks/useEntryForm'

interface EntryModalProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EntryModal({ productId, open, onOpenChange }: EntryModalProps) {
  function handleSuccess() {
    onOpenChange(false)
  }

  const { form, handleSubmit } = useEntryForm(productId, handleSuccess)
  const { register, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Dar entrada" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="entry-quantity"
          label="Quantidade a ser acrescida"
          type="number"
          min={1}
          placeholder="Quantidade"
          {...register('quantity')}
          error={errors.quantity?.message}
        />
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="primary">
            <Save size={15} />
            Salvar
          </Button>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            <X size={15} />
            Cancelar
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
