"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/features/auth/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DeleteAccountFormProps = {
  token: string | null
}

export function DeleteAccountForm({ token }: DeleteAccountFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)

  async function confirmDelete() {
    if (!token) {
      setError("Kein gültiger Token vorhanden.")
      return
    }

    setPending(true)
    setError(null)

    const { error: deleteError } = await authClient.deleteUser({ token })

    setPending(false)

    if (deleteError) {
      setError(deleteError.message ?? "Konto konnte nicht gelöscht werden.")
      return
    }

    setSuccess(true)
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Konto löschen</CardTitle>
        <CardDescription>
          {token
            ? "Bestätige die endgültige Löschung deines Kontos."
            : "Der Link ist ungültig oder unvollständig."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {success ? (
          <p className="text-sm text-muted-foreground">
            Dein Konto wurde gelöscht.
          </p>
        ) : (
          <>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {token ? (
              <Button
                type="button"
                variant="destructive"
                disabled={pending}
                onClick={() => void confirmDelete()}
              >
                {pending ? "Löschen…" : "Löschung bestätigen"}
              </Button>
            ) : null}
          </>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="/login"
          className="text-sm text-foreground underline-offset-4 hover:underline"
        >
          Zur Anmeldung
        </Link>
      </CardFooter>
    </Card>
  )
}
