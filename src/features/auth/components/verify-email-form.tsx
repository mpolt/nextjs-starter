"use client"

import Link from "next/link"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import { useState } from "react"

import { authClient } from "@/features/auth/client"
import { verifyEmailSchema } from "@/features/auth/schemas"
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

type VerifyEmailFormProps = {
  email?: string
}

export function VerifyEmailForm({ email = "" }: VerifyEmailFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      email,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: verifyEmailSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccess(false)

      const { error } = await authClient.sendVerificationEmail({
        email: value.email,
        callbackURL: "/dashboard",
      })

      if (error) {
        setFormError(error.message ?? "E-Mail konnte nicht gesendet werden.")
        return
      }

      setSuccess(true)
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">E-Mail bestätigen</CardTitle>
        <CardDescription>
          Wir haben dir einen Bestätigungslink geschickt. In der Entwicklung
          erscheint er in der Server-Konsole.
        </CardDescription>
      </CardHeader>
      <CardContent>
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

          {success ? (
            <p className="text-sm text-muted-foreground">
              Bestätigungslink erneut gesendet. Prüfe die Server-Konsole.
            </p>
          ) : null}

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Wird gesendet…" : "Link erneut senden"}
              </Button>
            )}
          </form.Subscribe>
        </form>
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
