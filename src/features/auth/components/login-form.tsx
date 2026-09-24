"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import { useState } from "react"

import { getSafeCallbackUrl } from "@/features/auth/callback-url"
import { authClient } from "@/features/auth/client"
import { loginSchema } from "@/features/auth/schemas"
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
import { PasswordInput } from "@/components/ui/password-input"
import { Separator } from "@/components/ui/separator"

type LoginFormProps = {
  callbackUrl?: string
  googleEnabled?: boolean
}

export function LoginForm({
  callbackUrl,
  googleEnabled = false,
}: LoginFormProps) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const redirectTo = getSafeCallbackUrl(callbackUrl)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: redirectTo,
      })

      if (error) {
        setFormError(error.message ?? "Anmeldung fehlgeschlagen.")
        return
      }

      router.push(redirectTo)
      router.refresh()
    },
  })

  async function signInWithGoogle() {
    setFormError(null)

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    })

    if (error) {
      setFormError(error.message ?? "Google-Anmeldung fehlgeschlagen.")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Anmelden</CardTitle>
        <CardDescription>
          Melde dich mit E-Mail und Passwort an.
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

          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>Passwort</Label>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  autoComplete="current-password"
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
                {isSubmitting ? "Wird angemeldet…" : "Anmelden"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        {googleEnabled ? (
          <>
            <div className="my-4 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">oder</span>
              <Separator className="flex-1" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => void signInWithGoogle()}
            >
              Mit Google fortfahren
            </Button>
          </>
        ) : null}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Noch kein Konto?{" "}
          <Link
            href={`/register?callbackUrl=${encodeURIComponent(redirectTo)}`}
            className="text-foreground underline-offset-4 hover:underline"
          >
            Registrieren
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
