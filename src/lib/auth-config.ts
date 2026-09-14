export function getGoogleAuthCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return null;
  }

  return { clientId, clientSecret };
}

export function isGoogleAuthEnabled() {
  return getGoogleAuthCredentials() !== null;
}

export function isAdminEmail(email: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(adminEmail && email.trim().toLowerCase() === adminEmail);
}

export function hasAdminRole(role?: string | null) {
  if (!role) {
    return false;
  }

  return role
    .split(",")
    .map((part) => part.trim())
    .includes("admin");
}
