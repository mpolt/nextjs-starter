import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import {
  getGoogleAuthCredentials,
  isAdminEmail,
} from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const google = getGoogleAuthCredentials();

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
      });
    },
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
      });
    },
  },
  socialProviders: google
    ? {
        google: {
          clientId: google.clientId,
          clientSecret: google.clientSecret,
          prompt: "select_account",
        },
      }
    : undefined,
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (!isAdminEmail(user.email)) {
            return;
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin" },
          });
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      bannedUserMessage:
        "Dein Konto wurde gesperrt. Bitte kontaktiere den Support, wenn du das für einen Fehler hältst.",
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
