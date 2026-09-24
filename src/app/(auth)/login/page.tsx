import { redirect } from "next/navigation"

import { LoginForm } from "@/features/auth/components/login-form"
import { getSafeCallbackUrl } from "@/features/auth/callback-url"
import { isGoogleAuthEnabled } from "@/features/auth/google"
import { getSession } from "@/features/auth/session"

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession()
  const params = await searchParams
  const callbackUrl = getSafeCallbackUrl(params.callbackUrl)

  if (session) {
    redirect(callbackUrl)
  }

  return (
    <LoginForm
      callbackUrl={callbackUrl}
      googleEnabled={isGoogleAuthEnabled}
    />
  )
}
