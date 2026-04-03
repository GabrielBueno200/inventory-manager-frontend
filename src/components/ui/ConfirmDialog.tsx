import { AlertTriangle } from 'lucide-react'
import { Dialog } from './Dialog'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  onConfirm,
}: ConfirmDialogProps) {
  function handleConfirm() {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="danger" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
