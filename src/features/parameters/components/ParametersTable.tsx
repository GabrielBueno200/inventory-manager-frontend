import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useParameterStore } from '@/store/useParameterStore'
import { useParameterForm } from '../hooks/useParameterForm'
import { ParameterFormModal } from './ParameterFormModal'

export function ParametersTable() {
  const parameters = useParameterStore((s) => s.parameters)
  const thresholds = useParameterStore((s) => s.thresholds)
  const { form, isOpen, setIsOpen, editing, openEdit, handleSubmit } = useParameterForm()

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Os limiares determinam como o estoque é classificado:{' '}
        <strong>Normal</strong> ≥ {thresholds.normal},{' '}
        <strong>Médio</strong> ≥ {thresholds.medium},{' '}
        <strong>Baixo</strong> &lt; {thresholds.medium}.
      </p>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-center font-semibold">Estado</th>
              <th className="px-4 py-3 text-center font-semibold">Quantidade mínima</th>
              <th className="px-4 py-3 text-center font-semibold">Cor</th>
              <th className="px-4 py-3 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, i) => (
              <tr key={param.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-center">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: param.color }}
                  >
                    {param.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-semibold text-gray-800">
                  {param.value}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="h-6 w-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: param.color }}
                      title={param.color}
                    />
                    <span className="text-xs text-gray-500">{param.color}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button size="sm" variant="edit" onClick={() => openEdit(param)}>
                    <Pencil size={13} />
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ParameterFormModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        editing={editing}
        form={form}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
