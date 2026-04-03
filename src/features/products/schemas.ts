import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional().default(''),
  accountIds: z.array(z.string()).min(1, 'Vincule ao menos uma conta'),
})

export type ProductFormValues = z.infer<typeof productSchema>
