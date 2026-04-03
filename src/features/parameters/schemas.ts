import { z } from 'zod'

export const parameterSchema = z.object({
  value: z.coerce.number().int().min(0, 'Deve ser ≥ 0'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
})

export type ParameterFormValues = z.infer<typeof parameterSchema>
