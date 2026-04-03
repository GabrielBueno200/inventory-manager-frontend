import { Save } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { useAccountForm } from '../hooks/useAccountForm'

interface AccountFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editing: { name: string } | null
  form: ReturnType<typeof useAccountForm>['form']
  onSubmit: () => void
}

export function AccountFormModal({
  isOpen,
  onOpenChange,
  editing,
  form,
  onSubmit,
}: AccountFormModalProps) {
  const { register, formState: { errors } } = form

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={editing ? 'Editar conta' : 'Nova conta'}
      maxWidth="max-w-sm"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          id="account-name"
          label="Nome da conta"
          placeholder="Ex: Loja Principal Shopee"
          {...register('name')}
          error={errors.name?.message}
        />
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
