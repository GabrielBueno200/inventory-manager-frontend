import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Package,
  Settings,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Store,
  List,
} from 'lucide-react'
import { clsx } from 'clsx'

interface NavGroup {
  label: string
  icon: React.ReactNode
  children: { label: string; to: string }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Estoque',
    icon: <Package size={18} />,
    children: [{ label: 'Gerenciamento', to: '/products' }],
  },
  {
    label: 'Contas',
    icon: <Store size={18} />,
    children: [{ label: 'Contas cadastradas', to: '/accounts' }],
  },
  {
    label: 'Configurações',
    icon: <Settings size={18} />,
    children: [{ label: 'Parâmetros', to: '/settings/parameters' }],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

function NavGroup({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  const location = useLocation()
  const isActive = group.children.some((c) => location.pathname.startsWith(c.to))
  const [open, setOpen] = useState(isActive)

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
          'text-stone-200 hover:bg-stone-700',
          isActive && 'bg-stone-700',
        )}
      >
        <span className="flex-shrink-0">{group.icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{group.label}</span>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </>
        )}
      </button>

      {!collapsed && open && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-stone-600 pl-3">
          {group.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-stone-600 text-white font-medium'
                    : 'text-stone-300 hover:bg-stone-700 hover:text-white',
                )
              }
            >
              <List size={14} />
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'flex flex-col bg-stone-800 text-white transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-14' : 'w-56',
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-stone-700">
        {!collapsed && (
          <span className="text-sm font-semibold text-stone-200 truncate">Estoque</span>
        )}
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <div className="flex flex-col items-center gap-1 py-5 border-b border-stone-700 px-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-600">
          <LayoutDashboard size={22} className="text-stone-200" />
        </div>
        {!collapsed && (
          <p className="text-xs text-stone-400 mt-1">Bem-vindo!</p>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.label} group={group} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  )
}
