import { redirect } from "next/navigation"

import { RegisterForm } from "@/features/auth/components/register-form"
import { getSafeCallbackUrl } from "@/features/auth/callback-url"
import { isGoogleAuthEnabled } from "@/features/auth/google"
import { getSession } from "@/features/auth/session"

type RegisterPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await getSession()
  const params = await searchParams
  const callbackUrl = getSafeCallbackUrl(params.callbackUrl)

  if (session) {
    redirect(callbackUrl)
  }

  return (
    <RegisterForm
      callbackUrl={callbackUrl}
      googleEnabled={isGoogleAuthEnabled}
    />
  )
}
