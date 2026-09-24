"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/features/auth/client"
import { Button } from "@/components/ui/button"

export function ImpersonationBanner() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function stopImpersonating() {
    setPending(true)
    await authClient.admin.stopImpersonating()
    setPending(false)
    router.push("/dashboard/admin")
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-amber-500/40 bg-amber-500/15 px-4 py-2 text-sm">
      <p>
        Du bist gerade als ein anderer Nutzer angemeldet (Impersonation).
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => void stopImpersonating()}
      >
        {pending ? "Beenden…" : "Impersonation beenden"}
      </Button>
    </div>
  )
}
