import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  maxWidth?: string
}

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  maxWidth = 'max-w-lg',
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full ${maxWidth} rounded-lg bg-white p-6 shadow-xl focus:outline-none
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
            data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`}
        >
          <div className="flex items-center justify-between mb-4">
            <RadixDialog.Title className="text-lg font-semibold text-gray-900">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              <X size={18} />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
