import { z } from "zod";

export const emailSchema = z
  .email("Bitte eine gültige E-Mail-Adresse eingeben.");

export const passwordSchema = z
  .string()
  .min(8, "Mindestens 8 Zeichen.")
  .max(128, "Maximal 128 Zeichen.");

export const nameSchema = z
  .string()
  .min(1, "Name ist erforderlich.")
  .max(100, "Name ist zu lang.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Passwort ist erforderlich."),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Bitte Passwort bestätigen."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Bitte Passwort bestätigen."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: nameSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Bitte Passwort bestätigen."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export const resendVerificationSchema = z.object({
  email: emailSchema,
});
