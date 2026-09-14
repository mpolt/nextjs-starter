import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    const pathname = (await headers()).get("x-pathname");
    const redirectTo = safeRedirectPath(pathname);
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  }
  return session;
}

export async function requireGuest() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }
}
