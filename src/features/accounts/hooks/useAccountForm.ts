import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAccountStore } from '@/store/useAccountStore'
import { accountsService } from '@/services/accounts'
import { accountSchema, type AccountFormValues } from '../schemas'
import type { Account } from '@/types'

export function useAccountForm() {
  const { accounts, isLoaded, setAccounts, addAccount, updateAccount, removeAccount } =
    useAccountStore()
  const [editing, setEditing] = useState<Account | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isLoaded) {
      accountsService.getAll().then(setAccounts)
    }
  }, [isLoaded, setAccounts])

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

  async function handleSubmit(values: AccountFormValues) {
    if (editing) {
      const updated = await accountsService.update(editing.id, values)
      updateAccount(updated)
    } else {
      const created = await accountsService.create(values)
      addAccount(created)
    }
    setIsOpen(false)
    form.reset()
    setEditing(null)
  }

  async function handleRemove(id: string) {
    await accountsService.remove(id)
    removeAccount(id)
  }

  return {
    accounts,
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
