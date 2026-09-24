import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { BackendShell } from "@/components/layout/backend-shell"
import { hasAdminRole } from "@/features/auth/roles"
import { getSession } from "@/features/auth/session"

type BackendLayoutProps = {
  children: React.ReactNode
}

export default async function BackendLayout({ children }: BackendLayoutProps) {
  const session = await getSession()
  const headerStore = await headers()
  const pathname =
    headerStore.get("x-pathname") ??
    headerStore.get("x-url") ??
    "/dashboard"

  if (!session) {
    const callbackUrl = encodeURIComponent(pathname)
    redirect(`/login?callbackUrl=${callbackUrl}`)
  }

  const role = (session.user as { role?: string | string[] }).role
  const isAdmin = hasAdminRole(role)
  const isImpersonating = Boolean(
    (session.session as { impersonatedBy?: string | null }).impersonatedBy
  )

  return (
    <BackendShell
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
      isAdmin={isAdmin}
      isImpersonating={isImpersonating}
    >
      {children}
    </BackendShell>
  )
}
