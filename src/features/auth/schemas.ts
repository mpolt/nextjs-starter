import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, { error: "Passwort muss mindestens 8 Zeichen haben." })

export const loginSchema = z.object({
  email: z.email({ error: "Bitte eine gültige E-Mail eingeben." }),
  password: passwordSchema,
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name muss mindestens 2 Zeichen haben." })
    .trim(),
  email: z.email({ error: "Bitte eine gültige E-Mail eingeben." }),
  password: passwordSchema,
})

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Bitte eine gültige E-Mail eingeben." }),
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  })

export const verifyEmailSchema = z.object({
  email: z.email({ error: "Bitte eine gültige E-Mail eingeben." }),
})

export const updateNameSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name muss mindestens 2 Zeichen haben." })
    .trim(),
})

export const changeEmailSchema = z.object({
  newEmail: z.email({ error: "Bitte eine gültige E-Mail eingeben." }),
})

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  })

export const deleteAccountSchema = z.object({
  password: passwordSchema.optional(),
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>
export type UpdateNameValues = z.infer<typeof updateNameSchema>
export type ChangeEmailValues = z.infer<typeof changeEmailSchema>
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>
