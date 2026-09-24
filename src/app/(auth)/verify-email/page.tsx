import { VerifyEmailForm } from "@/features/auth/components/verify-email-form"
import { getSession } from "@/features/auth/session"
import { redirect } from "next/navigation"

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const session = await getSession()
  const params = await searchParams

  if (session) {
    redirect("/dashboard")
  }

  return <VerifyEmailForm email={params.email ?? ""} />
}
