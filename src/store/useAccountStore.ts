import { create } from 'zustand'
import type { Account } from '@/types'

interface AccountStore {
  accounts: Account[]
  isLoaded: boolean
  setAccounts: (accounts: Account[]) => void
  addAccount: (account: Account) => void
  updateAccount: (account: Account) => void
  removeAccount: (id: string) => void
}

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: [],
  isLoaded: false,

  setAccounts: (accounts) => set({ accounts, isLoaded: true }),

  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),

  updateAccount: (account) =>
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === account.id ? account : a)),
    })),

  removeAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
    })),
}))
