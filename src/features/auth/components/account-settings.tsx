"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import { useCallback, useEffect, useState } from "react"

import { authClient } from "@/features/auth/client"
import {
  changeEmailSchema,
  changePasswordSchema,
  updateNameSchema,
} from "@/features/auth/schemas"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"

type AccountUser = {
  id: string
  name: string
  email: string
  emailVerified: boolean
}

type SessionItem = {
  id: string
  token: string
  createdAt: Date | string
  updatedAt: Date | string
  expiresAt: Date | string
  ipAddress?: string | null
  userAgent?: string | null
}

type AccountSettingsProps = {
  user: AccountUser
  currentSessionToken?: string
}

function fieldError(errors: unknown[]) {
  const first = errors[0]
  if (!first) return null
  if (typeof first === "object" && first !== null && "message" in first) {
    return String((first as { message?: string }).message ?? first)
  }
  return String(first)
}

export function AccountSettings({
  user,
  currentSessionToken,
}: AccountSettingsProps) {
  const router = useRouter()
  const [hasCredential, setHasCredential] = useState(false)
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [nameMessage, setNameMessage] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailMessage, setEmailMessage] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleting, setDeleting] = useState(false)

  const refreshMeta = useCallback(async () => {
    setLoadingMeta(true)
    setSessionError(null)

    const [accountsResult, sessionsResult] = await Promise.all([
      authClient.listAccounts(),
      authClient.listSessions(),
    ])

    if (accountsResult.data) {
      setHasCredential(
        accountsResult.data.some((account) => account.providerId === "credential")
      )
    }

    if (sessionsResult.error) {
      setSessionError(
        sessionsResult.error.message ?? "Sessions konnten nicht geladen werden."
      )
    } else if (sessionsResult.data) {
      setSessions(sessionsResult.data as SessionItem[])
    }

    setLoadingMeta(false)
  }, [])

  useEffect(() => {
    void refreshMeta()
  }, [refreshMeta])

  const nameForm = useForm({
    defaultValues: { name: user.name },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: updateNameSchema },
    onSubmit: async ({ value }) => {
      setNameError(null)
      setNameMessage(null)

      const { error } = await authClient.updateUser({ name: value.name })
      if (error) {
        setNameError(error.message ?? "Name konnte nicht gespeichert werden.")
        return
      }

      setNameMessage("Name gespeichert.")
      router.refresh()
    },
  })

  const emailForm = useForm({
    defaultValues: { newEmail: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: changeEmailSchema },
    onSubmit: async ({ value }) => {
      setEmailError(null)
      setEmailMessage(null)

      const { error } = await authClient.changeEmail({
        newEmail: value.newEmail,
        callbackURL: "/dashboard/account",
      })

      if (error) {
        setEmailError(error.message ?? "E-Mail konnte nicht geändert werden.")
        return
      }

      setEmailMessage(
        "Bestätigungslink an die neue Adresse gesendet. In der Entwicklung erscheint er in der Server-Konsole."
      )
      emailForm.reset()
    },
  })

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: changePasswordSchema },
    onSubmit: async ({ value }) => {
      setPasswordError(null)
      setPasswordMessage(null)

      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        setPasswordError(
          error.message ?? "Passwort konnte nicht geändert werden."
        )
        return
      }

      setPasswordMessage("Passwort aktualisiert. Andere Sessions wurden beendet.")
      passwordForm.reset()
      void refreshMeta()
    },
  })

  async function revokeSession(token: string) {
    setSessionError(null)
    const { error } = await authClient.revokeSession({ token })
    if (error) {
      setSessionError(error.message ?? "Session konnte nicht beendet werden.")
      return
    }
    void refreshMeta()
  }

  async function revokeOtherSessions() {
    setSessionError(null)
    const { error } = await authClient.revokeOtherSessions()
    if (error) {
      setSessionError(error.message ?? "Sessions konnten nicht beendet werden.")
      return
    }
    void refreshMeta()
  }

  async function handleDeleteAccount() {
    setDeleteError(null)
    setDeleteMessage(null)
    setDeleting(true)

    const { data, error } = await authClient.deleteUser({
      ...(hasCredential && deletePassword
        ? { password: deletePassword }
        : {}),
      callbackURL: "/login",
    })

    setDeleting(false)

    if (error) {
      setDeleteError(error.message ?? "Konto konnte nicht gelöscht werden.")
      return
    }

    if (data?.message === "Verification email sent") {
      setDeleteMessage(
        "Bestätigungslink zum Löschen gesendet. In der Entwicklung erscheint er in der Server-Konsole."
      )
      return
    }

    router.push("/login")
    router.refresh()
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Konto
        </h1>
        <p className="text-muted-foreground">
          Verwalte Profil, E-Mail, Passwort und aktive Sitzungen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Aktuelle E-Mail: {user.email}
            {user.emailVerified ? " (bestätigt)" : " (nicht bestätigt)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              void nameForm.handleSubmit()
            }}
          >
            <nameForm.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  {fieldError(field.state.meta.errors) ? (
                    <p className="text-xs text-destructive">
                      {fieldError(field.state.meta.errors)}
                    </p>
                  ) : null}
                </div>
              )}
            </nameForm.Field>
            {nameError ? (
              <p className="text-sm text-destructive">{nameError}</p>
            ) : null}
            {nameMessage ? (
              <p className="text-sm text-muted-foreground">{nameMessage}</p>
            ) : null}
            <nameForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting} className="w-fit">
                  {isSubmitting ? "Speichern…" : "Name speichern"}
                </Button>
              )}
            </nameForm.Subscribe>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>E-Mail ändern</CardTitle>
          <CardDescription>
            Die neue Adresse muss über den Bestätigungslink verifiziert werden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              void emailForm.handleSubmit()
            }}
          >
            <emailForm.Field name="newEmail">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Neue E-Mail</Label>
                  <Input
                    id={field.name}
                    type="email"
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  {fieldError(field.state.meta.errors) ? (
                    <p className="text-xs text-destructive">
                      {fieldError(field.state.meta.errors)}
                    </p>
                  ) : null}
                </div>
              )}
            </emailForm.Field>
            {emailError ? (
              <p className="text-sm text-destructive">{emailError}</p>
            ) : null}
            {emailMessage ? (
              <p className="text-sm text-muted-foreground">{emailMessage}</p>
            ) : null}
            <emailForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting} className="w-fit">
                  {isSubmitting ? "Senden…" : "E-Mail ändern"}
                </Button>
              )}
            </emailForm.Subscribe>
          </form>
        </CardContent>
      </Card>

      {hasCredential ? (
        <Card>
          <CardHeader>
            <CardTitle>Passwort ändern</CardTitle>
            <CardDescription>
              Andere Sitzungen werden nach dem Ändern beendet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                void passwordForm.handleSubmit()
              }}
            >
              <passwordForm.Field name="currentPassword">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>Aktuelles Passwort</Label>
                    <PasswordInput
                      id={field.name}
                      autoComplete="current-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {fieldError(field.state.meta.errors) ? (
                      <p className="text-xs text-destructive">
                        {fieldError(field.state.meta.errors)}
                      </p>
                    ) : null}
                  </div>
                )}
              </passwordForm.Field>
              <passwordForm.Field name="newPassword">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>Neues Passwort</Label>
                    <PasswordInput
                      id={field.name}
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {fieldError(field.state.meta.errors) ? (
                      <p className="text-xs text-destructive">
                        {fieldError(field.state.meta.errors)}
                      </p>
                    ) : null}
                  </div>
                )}
              </passwordForm.Field>
              <passwordForm.Field name="confirmPassword">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>Passwort bestätigen</Label>
                    <PasswordInput
                      id={field.name}
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {fieldError(field.state.meta.errors) ? (
                      <p className="text-xs text-destructive">
                        {fieldError(field.state.meta.errors)}
                      </p>
                    ) : null}
                  </div>
                )}
              </passwordForm.Field>
              {passwordError ? (
                <p className="text-sm text-destructive">{passwordError}</p>
              ) : null}
              {passwordMessage ? (
                <p className="text-sm text-muted-foreground">{passwordMessage}</p>
              ) : null}
              <passwordForm.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button type="submit" disabled={isSubmitting} className="w-fit">
                    {isSubmitting ? "Speichern…" : "Passwort ändern"}
                  </Button>
                )}
              </passwordForm.Subscribe>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Passwort</CardTitle>
            <CardDescription>
              Dein Konto hat noch kein Passwort. Nutze{" "}
              <Link
                href="/forgot-password"
                className="underline-offset-4 hover:underline"
              >
                Passwort vergessen
              </Link>
              , um eines zu setzen.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Aktive Sitzungen</CardTitle>
          <CardDescription>
            Beende Sitzungen auf anderen Geräten.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loadingMeta ? (
            <p className="text-sm text-muted-foreground">Laden…</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Sitzungen.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {sessions.map((session) => {
                const isCurrent = session.token === currentSessionToken
                return (
                  <li
                    key={session.id}
                    className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 text-sm">
                      <p className="font-medium">
                        {isCurrent ? "Diese Sitzung" : "Andere Sitzung"}
                      </p>
                      <p className="truncate text-muted-foreground">
                        {session.userAgent || "Unbekannter Client"}
                      </p>
                      {session.ipAddress ? (
                        <p className="text-xs text-muted-foreground">
                          IP: {session.ipAddress}
                        </p>
                      ) : null}
                    </div>
                    {!isCurrent ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void revokeSession(session.token)}
                      >
                        Beenden
                      </Button>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          )}
          {sessionError ? (
            <p className="text-sm text-destructive">{sessionError}</p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => void revokeOtherSessions()}
            disabled={sessions.length <= 1}
          >
            Andere Sitzungen beenden
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konto löschen</CardTitle>
          <CardDescription>
            Diese Aktion ist endgültig. Alle Daten werden entfernt.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {hasCredential ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="delete-password">Passwort zur Bestätigung</Label>
              <PasswordInput
                id="delete-password"
                autoComplete="current-password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ohne Passwort erhältst du einen Bestätigungslink per E-Mail.
            </p>
          )}
          {deleteError ? (
            <p className="text-sm text-destructive">{deleteError}</p>
          ) : null}
          {deleteMessage ? (
            <p className="text-sm text-muted-foreground">{deleteMessage}</p>
          ) : null}
          <Button
            type="button"
            variant="destructive"
            className="w-fit"
            disabled={deleting || (hasCredential && !deletePassword)}
            onClick={() => void handleDeleteAccount()}
          >
            {deleting ? "Löschen…" : "Konto löschen"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
