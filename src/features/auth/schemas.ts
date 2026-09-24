import { z } from "zod"

export const loginSchema = z.object({
  email: z.email({ error: "Bitte eine gültige E-Mail eingeben." }),
  password: z
    .string()
    .min(8, { error: "Passwort muss mindestens 8 Zeichen haben." }),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name muss mindestens 2 Zeichen haben." })
    .trim(),
  email: z.email({ error: "Bitte eine gültige E-Mail eingeben." }),
  password: z
    .string()
    .min(8, { error: "Passwort muss mindestens 8 Zeichen haben." }),
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
