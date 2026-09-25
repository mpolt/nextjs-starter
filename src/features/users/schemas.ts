import { z } from "zod"

const roleSchema = z.enum(["user", "admin"], {
  error: "Bitte eine gültige Rolle wählen.",
})

const nameSchema = z
  .string()
  .min(2, { error: "Name muss mindestens 2 Zeichen haben." })
  .trim()

const emailSchema = z.email({ error: "Bitte eine gültige E-Mail eingeben." })

const passwordSchema = z
  .string()
  .min(8, { error: "Passwort muss mindestens 8 Zeichen haben." })

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
})

export const updateUserSchema = z.object({
  id: z.string().min(1, { error: "Nutzer fehlt." }),
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
})

/** Form values always include password; edit ignores it. */
export const createUserFormSchema = createUserSchema

export const updateUserFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z.string(),
  role: roleSchema,
})

export const deleteUserSchema = z.object({
  id: z.string().min(1, { error: "Nutzer fehlt." }),
})

export type CreateUserValues = z.infer<typeof createUserSchema>
export type UpdateUserValues = z.infer<typeof updateUserSchema>
export type DeleteUserValues = z.infer<typeof deleteUserSchema>
export type UserFormValues = z.infer<typeof createUserFormSchema>
export type UserRole = z.infer<typeof roleSchema>
