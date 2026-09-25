import { redirect } from "next/navigation"

import { UsersPaginationView } from "@/features/users/components/users-pagination-view"
import { hasAdminRole } from "@/features/auth/roles"
import { getSession } from "@/features/auth/session"

export default async function UsersPaginationPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/users-pagination")
  }

  const role = (session.user as { role?: string | string[] }).role

  if (!hasAdminRole(role)) {
    redirect("/dashboard")
  }

  return <UsersPaginationView />
}
