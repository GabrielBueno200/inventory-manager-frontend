import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAccountStore } from '@/store/useAccountStore'
import { accountSchema, type AccountFormValues } from '../schemas'
import type { Account } from '@/types'

export function useAccountForm() {
  const addAccount = useAccountStore((s) => s.addAccount)
  const updateAccount = useAccountStore((s) => s.updateAccount)
  const removeAccount = useAccountStore((s) => s.removeAccount)
  const [editing, setEditing] = useState<Account | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: '' },
  })

  function openNew() {
    form.reset({ name: '' })
    setEditing(null)
    setIsOpen(true)
  }

  function openEdit(account: Account) {
    form.reset({ name: account.name })
    setEditing(account)
    setIsOpen(true)
  }

  function handleSubmit(values: AccountFormValues) {
    if (editing) {
      updateAccount(editing.id, values)
    } else {
      addAccount(values)
    }
    setIsOpen(false)
    form.reset()
    setEditing(null)
  }

  function handleRemove(id: string) {
    removeAccount(id)
  }

  return {
    form,
    isOpen,
    setIsOpen,
    editing,
    openNew,
    openEdit,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleRemove,
  }
}
