import { redirect } from "next/navigation"

import { UsersView } from "@/features/users/components/users-view"
import { hasAdminRole } from "@/features/auth/roles"
import { getSession } from "@/features/auth/session"

export default async function UsersPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/users")
  }

  const role = (session.user as { role?: string | string[] }).role

  if (!hasAdminRole(role)) {
    redirect("/dashboard")
  }

  // userID damit man sich nicht selbst löschen kann
  return <UsersView currentUserId={session.user.id} />
}
