import { useState, useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParameterStore } from '@/store/useParameterStore'
import { parametersService } from '@/services/parameters'
import { parameterSchema, type ParameterFormValues } from '../schemas'
import type { StockParameter } from '@/types'

export function useParameterForm() {
  const { parameters, isLoaded, setParameters, updateParameter } = useParameterStore()
  const [editing, setEditing] = useState<StockParameter | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isLoaded) {
      parametersService.getAll().then(setParameters)
    }
  }, [isLoaded, setParameters])

  const form = useForm<ParameterFormValues>({
    resolver: zodResolver(parameterSchema) as Resolver<ParameterFormValues>,
    defaultValues: { value: 10, color: '#16a34a' },
  })

  function openEdit(parameter: StockParameter) {
    form.reset({ value: parameter.value, color: parameter.color })
    setEditing(parameter)
    setIsOpen(true)
  }

  async function handleSubmit(values: ParameterFormValues) {
    if (editing) {
      const updated = await parametersService.update(editing.id, values)
      updateParameter(updated)
    }
    setIsOpen(false)
    setEditing(null)
  }

  return {
    parameters,
    form,
    isOpen,
    setIsOpen,
    editing,
    openEdit,
    handleSubmit: form.handleSubmit(handleSubmit),
  }
}
