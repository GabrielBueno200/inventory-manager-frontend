import { z } from 'zod'

export const entrySchema = z.object({
  quantity: z.coerce
    .number()
    .int('Informe um número inteiro')
    .min(1, 'Quantidade deve ser ao menos 1'),
  notes: z.string().max(200).optional(),
})

export const exitSchema = z.object({
  accountId: z.string().min(1, 'Selecione uma conta'),
  quantity: z.coerce
    .number()
    .int('Informe um número inteiro')
    .min(1, 'Quantidade deve ser ao menos 1'),
  notes: z.string().max(200).optional(),
})

export type EntryFormValues = z.infer<typeof entrySchema>
export type ExitFormValues = z.infer<typeof exitSchema>
