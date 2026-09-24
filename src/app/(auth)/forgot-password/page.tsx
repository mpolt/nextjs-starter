import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import { getSession } from "@/features/auth/session"
import { redirect } from "next/navigation"

export default async function ForgotPasswordPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return <ForgotPasswordForm />
}
