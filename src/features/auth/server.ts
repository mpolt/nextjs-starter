import "server-only"

import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { admin } from "better-auth/plugins"

import { sendEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const isGoogleAuthEnabled = Boolean(googleClientId && googleClientSecret)

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Passwort zurücksetzen",
        text: `Klicke auf den Link, um dein Passwort zurückzusetzen:\n${url}`,
      })
    },
    onExistingUserSignUp: async ({ user }) => {
      void sendEmail({
        to: user.email,
        subject: "Registrierungsversuch mit deiner E-Mail",
        text: "Jemand hat versucht, ein Konto mit deiner E-Mail-Adresse zu erstellen. Wenn du das warst, melde dich an. Falls nicht, kannst du diese Nachricht ignorieren.",
      })
    },
    customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
      ...coreFields,
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
      ...additionalFields,
      id,
    }),
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "E-Mail-Adresse bestätigen",
        text: `Klicke auf den Link, um deine E-Mail-Adresse zu bestätigen:\n${url}`,
      })
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, token }) => {
        const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
        const deleteUrl = `${baseUrl}/delete-account?token=${encodeURIComponent(token)}`
        void sendEmail({
          to: user.email,
          subject: "Konto löschen bestätigen",
          text: `Klicke auf den Link, um die Löschung deines Kontos zu bestätigen:\n${deleteUrl}`,
        })
      },
    },
  },
  socialProviders: {
    ...(isGoogleAuthEnabled
      ? {
          google: {
            clientId: googleClientId!,
            clientSecret: googleClientSecret!,
          },
        }
      : {}),
  },
  plugins: [admin(), nextCookies()],
})
