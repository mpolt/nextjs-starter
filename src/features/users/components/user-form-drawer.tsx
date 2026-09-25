"use client"

import { useId, useState } from "react"
import { revalidateLogic, useForm } from "@tanstack/react-form"

import { FormDrawer } from "@/components/shared/form-drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateUser,
  useUpdateUser,
} from "@/features/users/hooks/use-user-mutations"
import {
  createUserFormSchema,
  updateUserFormSchema,
  type UserRole,
} from "@/features/users/schemas"
import { parseUserRoles, type UserListItem } from "@/features/users/types"

const FORM_ID = "user-form"

type UserFormDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserListItem | null
}

function getPrimaryRole(role: string): UserRole {
  const roles = parseUserRoles(role)
  if (roles.includes("admin")) return "admin"
  return "user"
}

function fieldErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    error.message != null
  ) {
    return String(error.message)
  }

  return String(error ?? "")
}

export function UserFormDrawer({
  open,
  onOpenChange,
  user,
}: UserFormDrawerProps) {
  const isEdit = Boolean(user)
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const [formError, setFormError] = useState<string | null>(null)
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const roleId = useId()

  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: (user ? getPrimaryRole(user.role) : "user") as UserRole,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: isEdit ? updateUserFormSchema : createUserFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        if (isEdit && user) {
          await updateMutation.mutateAsync({
            id: user.id,
            name: value.name,
            email: value.email,
            role: value.role,
          })
        } else {
          await createMutation.mutateAsync({
            name: value.name,
            email: value.email,
            password: value.password,
            role: value.role,
          })
        }
        onOpenChange(false)
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : "Speichern fehlgeschlagen."
        )
      }
    },
  })

  const pending = createMutation.isPending || updateMutation.isPending

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Nutzer bearbeiten" : "Nutzer anlegen"}
      description={
        isEdit
          ? "Name, E-Mail und Rolle aktualisieren."
          : "Neuen Nutzer mit Passwort und Rolle anlegen."
      }
      formId={FORM_ID}
      submitLabel={isEdit ? "Speichern" : "Anlegen"}
      pending={pending}
    >
      <form
        id={FORM_ID}
        className="flex flex-col gap-4 py-2"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field name="name">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={nameId}>Name</Label>
              <Input
                id={nameId}
                name={field.name}
                type="text"
                autoComplete="name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrorMessage(field.state.meta.errors[0])}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={emailId}>E-Mail</Label>
              <Input
                id={emailId}
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
                  {fieldErrorMessage(field.state.meta.errors[0])}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {!isEdit ? (
          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={passwordId}>Passwort</Label>
                <PasswordInput
                  id={passwordId}
                  name={field.name}
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors[0] ? (
                  <p className="text-xs text-destructive">
                    {fieldErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        ) : null}

        <form.Field name="role">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={roleId}>Rolle</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  if (value === "user" || value === "admin") {
                    field.handleChange(value)
                  }
                }}
              >
                <SelectTrigger id={roleId} className="w-full">
                  <SelectValue placeholder="Rolle wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrorMessage(field.state.meta.errors[0])}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {formError ? (
          <p className="text-sm text-destructive" role="alert">
            {formError}
          </p>
        ) : null}
      </form>
    </FormDrawer>
  )
}
