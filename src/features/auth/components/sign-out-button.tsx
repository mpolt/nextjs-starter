"use client"

import { useRouter } from "next/navigation"

import { authClient } from "@/features/auth/client"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Button type="button" variant="outline" onClick={() => void handleSignOut()}>
      Abmelden
    </Button>
  )
}
