import { AccountSettings } from "@/features/auth/components/account-settings"
import { getSession } from "@/features/auth/session"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/account")
  }

  return (
    <AccountSettings
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
      }}
      currentSessionToken={session.session.token}
    />
  )
}
