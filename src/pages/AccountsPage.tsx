import { useState } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AccountFormModal } from '@/features/accounts/components/AccountFormModal'
import { useAccountForm } from '@/features/accounts/hooks/useAccountForm'
import { useAccountStore } from '@/store/useAccountStore'
import type { Account } from '@/types'

export function AccountsPage() {
  const navigate = useNavigate()
  const accounts = useAccountStore((s) => s.accounts)
  const { form, isOpen, setIsOpen, editing, openNew, openEdit, handleSubmit, handleRemove } =
    useAccountForm()
  const [confirmTarget, setConfirmTarget] = useState<Account | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Contas cadastradas</h1>
        </div>
        <Button variant="primary" onClick={openNew}>
          <Plus size={16} />
          Nova conta
        </Button>
      </div>

      {accounts.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-10">
          Nenhuma conta cadastrada.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Nome</th>
                <th className="px-4 py-3 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, i) => (
                <tr key={account.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{account.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="sm" variant="edit" onClick={() => openEdit(account)}>
                        <Pencil size={13} />
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setConfirmTarget(account)}>
                        <Trash2 size={13} />
                        Remover
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AccountFormModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        editing={editing}
        form={form}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}
        title="Remover conta"
        description={`Tem certeza que deseja remover "${confirmTarget?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Remover"
        onConfirm={() => {
          if (confirmTarget) handleRemove(confirmTarget.id)
        }}
      />
    </div>
  )
}
