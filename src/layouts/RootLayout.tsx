import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useParameterStore } from '@/store/useParameterStore'
import { useAccountStore } from '@/store/useAccountStore'
import { parametersService } from '@/services/parameters'
import { accountsService } from '@/services/accounts'

export function RootLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const isParametersLoaded = useParameterStore((s) => s.isLoaded)
  const setParameters = useParameterStore((s) => s.setParameters)
  const isAccountsLoaded = useAccountStore((s) => s.isLoaded)
  const setAccounts = useAccountStore((s) => s.setAccounts)

  useEffect(() => {
    if (!isParametersLoaded) {
      parametersService.getAll().then(setParameters)
    }
  }, [isParametersLoaded, setParameters])

  useEffect(() => {
    if (!isAccountsLoaded) {
      accountsService.getAll().then(setAccounts)
    }
  }, [isAccountsLoaded, setAccounts])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
