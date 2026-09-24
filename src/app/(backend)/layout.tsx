import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { BackendShell } from "@/components/layout/backend-shell"
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

  return (
    <BackendShell
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    >
      {children}
    </BackendShell>
  )
}
