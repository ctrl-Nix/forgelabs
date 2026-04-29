import { z } from 'zod'

export const ProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
})

export const ForgeInsightSchema = z.object({
  projectId: z.string().uuid().optional(),
  idea: z.string().min(3),
  audience: z.string().min(3),
  monetization: z.string().min(3),
})


export const ZeroDaySchema = z.object({
  code: z.string().min(1),
  error: z.string().optional(),
  language: z.string().min(1),
})
