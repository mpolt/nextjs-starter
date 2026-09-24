import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import { getSession } from "@/features/auth/session"
import { redirect } from "next/navigation"

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string; error?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const session = await getSession()
  const params = await searchParams

  if (session) {
    redirect("/dashboard")
  }

  return (
    <ResetPasswordForm token={params.token ?? null} error={params.error} />
  )
}
