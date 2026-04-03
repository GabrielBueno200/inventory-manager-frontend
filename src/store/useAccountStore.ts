import { create } from 'zustand'
import { mockAccounts } from '@/mocks/data'
import type { Account } from '@/types'

interface AccountStore {
  accounts: Account[]
  addAccount: (account: Omit<Account, 'id'>) => void
  updateAccount: (id: string, data: Partial<Omit<Account, 'id'>>) => void
  removeAccount: (id: string) => void
}

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: mockAccounts,

  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, { ...account, id: `acc-${Date.now()}` }],
    })),

  updateAccount: (id, data) =>
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
    })),

  removeAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
    })),
}))
