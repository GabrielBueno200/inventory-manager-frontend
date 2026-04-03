import { z } from 'zod'

export const accountSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
})

export type AccountFormValues = z.infer<typeof accountSchema>
