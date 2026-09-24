"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import { useState } from "react"

import { authClient } from "@/features/auth/client"
import { resetPasswordSchema } from "@/features/auth/schemas"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"

type ResetPasswordFormProps = {
  token: string | null
  error?: string | null
}

export function ResetPasswordForm({ token, error }: ResetPasswordFormProps) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(
    error === "INVALID_TOKEN"
      ? "Der Link ist ungültig oder abgelaufen."
      : null
  )
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        setFormError("Kein gültiger Token vorhanden.")
        return
      }

      setFormError(null)

      const { error: resetError } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      })

      if (resetError) {
        setFormError(resetError.message ?? "Passwort konnte nicht gesetzt werden.")
        return
      }

      setSuccess(true)
      router.refresh()
    },
  })

  if (!token && !error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Passwort zurücksetzen</CardTitle>
          <CardDescription>
            Der Link ist ungültig oder unvollständig.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href="/forgot-password"
            className="text-sm text-foreground underline-offset-4 hover:underline"
          >
            Neuen Link anfordern
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Neues Passwort</CardTitle>
        <CardDescription>
          Vergib ein neues Passwort für dein Konto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <p className="text-sm text-muted-foreground">
            Dein Passwort wurde aktualisiert. Du kannst dich jetzt anmelden.
          </p>
        ) : (
          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void form.handleSubmit()
            }}
          >
            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Neues Passwort</Label>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    autoComplete="new-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  {field.state.meta.errors[0] ? (
                    <p className="text-xs text-destructive">
                      {String(
                        field.state.meta.errors[0]?.message ??
                          field.state.meta.errors[0]
                      )}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Passwort bestätigen</Label>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    autoComplete="new-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  {field.state.meta.errors[0] ? (
                    <p className="text-xs text-destructive">
                      {String(
                        field.state.meta.errors[0]?.message ??
                          field.state.meta.errors[0]
                      )}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full"
                >
                  {isSubmitting ? "Wird gespeichert…" : "Passwort speichern"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          <Link
            href="/login"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Zur Anmeldung
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
