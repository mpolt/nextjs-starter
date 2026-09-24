"use client"

import Link from "next/link"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import { useState } from "react"

import { authClient } from "@/features/auth/client"
import { forgotPasswordSchema } from "@/features/auth/schemas"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/reset-password",
      })

      if (error) {
        setFormError(error.message ?? "Anfrage fehlgeschlagen.")
        return
      }

      setSuccess(true)
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Passwort vergessen</CardTitle>
        <CardDescription>
          Gib deine E-Mail-Adresse ein. Falls ein Konto existiert, erhältst du
          einen Link zum Zurücksetzen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <p className="text-sm text-muted-foreground">
            Wenn ein Konto mit dieser Adresse existiert, wurde ein Link zum
            Zurücksetzen gesendet. In der Entwicklung erscheint er in der
            Server-Konsole.
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
            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>E-Mail</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
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
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Wird gesendet…" : "Link senden"}
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
            Zurück zur Anmeldung
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
