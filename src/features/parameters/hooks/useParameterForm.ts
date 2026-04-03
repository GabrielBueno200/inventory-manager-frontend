import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParameterStore } from '@/store/useParameterStore'
import { parameterSchema, type ParameterFormValues } from '../schemas'
import type { StockParameter, StockParameterId } from '@/types'

export function useParameterForm() {
  const updateParameter = useParameterStore((s) => s.updateParameter)
  const [editing, setEditing] = useState<StockParameter | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<ParameterFormValues>({
    resolver: zodResolver(parameterSchema) as Resolver<ParameterFormValues>,
    defaultValues: { value: 10, color: '#16a34a' },
  })

  function openEdit(parameter: StockParameter) {
    form.reset({ value: parameter.value, color: parameter.color })
    setEditing(parameter)
    setIsOpen(true)
  }

  function handleSubmit(values: ParameterFormValues) {
    if (editing) {
      updateParameter(editing.id as StockParameterId, values)
    }
    setIsOpen(false)
    setEditing(null)
  }

  return {
    form,
    isOpen,
    setIsOpen,
    editing,
    openEdit,
    handleSubmit: form.handleSubmit(handleSubmit),
  }
}
