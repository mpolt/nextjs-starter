import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  changePassword,
  updateUser,
  sendVerificationEmail,
  listSessions,
  revokeSession,
  revokeOtherSessions,
} = authClient;
