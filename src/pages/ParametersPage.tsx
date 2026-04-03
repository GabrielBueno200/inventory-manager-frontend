import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ParametersTable } from '@/features/parameters/components/ParametersTable'

export function ParametersPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Parâmetros</h1>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ParametersTable />
      </div>
    </div>
  )
}
