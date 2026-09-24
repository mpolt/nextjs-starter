import { redirect } from "next/navigation"

import { AdminUsersPanel } from "@/features/auth/components/admin-users-panel"
import { hasAdminRole } from "@/features/auth/roles"
import { getSession } from "@/features/auth/session"

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/admin")
  }

  const role = (session.user as { role?: string | string[] }).role

  if (!hasAdminRole(role)) {
    redirect("/dashboard")
  }

  return <AdminUsersPanel currentUserId={session.user.id} />
}
