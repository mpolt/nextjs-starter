"use client";

import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import {
  PasswordField,
  SelectField,
  TextField,
} from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { withDynamicSchema } from "@/lib/form";
import type { AdminUserRow } from "@/lib/admin-users";
import { hasAdminRole } from "@/lib/auth-config";
import {
  adminCreateUserSchema,
  adminEditUserSchema,
} from "@/lib/validations/auth";

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

type UserFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user: AdminUserRow | null;
  currentUserId: string;
  onSuccess: () => void;
};

export function UserFormSheet({
  open,
  onOpenChange,
  mode,
  user,
  currentUserId,
  onSuccess,
}: UserFormSheetProps) {
  const isCreate = mode === "create";
  const isSelf = Boolean(user && user.id === currentUserId);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user" as "user" | "admin",
    },
    ...(isCreate
      ? withDynamicSchema(adminCreateUserSchema)
      : withDynamicSchema(adminEditUserSchema)),
    onSubmit: async ({ value }) => {
      if (isCreate) {
        const { data, error } = await authClient.admin.createUser({
          name: value.name,
          email: value.email,
          password: value.password,
          role: value.role,
        });

        if (error) {
          toast.error(error.message ?? "Benutzer konnte nicht angelegt werden.");
          return;
        }

        const createdId =
          data && typeof data === "object" && "user" in data
            ? (data as { user: { id: string } }).user.id
            : data && typeof data === "object" && "id" in data
              ? (data as { id: string }).id
              : null;

        if (createdId) {
          const verifyResult = await authClient.admin.updateUser({
            userId: createdId,
            data: { emailVerified: true },
          });
          if (verifyResult.error) {
            toast.warning(
              "Benutzer angelegt, E-Mail konnte aber nicht als bestätigt markiert werden.",
            );
          } else {
            toast.success("Benutzer angelegt.");
          }
        } else {
          toast.success("Benutzer angelegt.");
        }

        onOpenChange(false);
        onSuccess();
        return;
      }

      if (!user) {
        return;
      }

      const { error: updateError } = await authClient.admin.updateUser({
        userId: user.id,
        data: {
          name: value.name,
          email: value.email,
        },
      });

      if (updateError) {
        toast.error(
          updateError.message ?? "Benutzer konnte nicht gespeichert werden.",
        );
        return;
      }

      const currentRole = hasAdminRole(user.role) ? "admin" : "user";
      if (!isSelf && value.role !== currentRole) {
        const { error: roleError } = await authClient.admin.setRole({
          userId: user.id,
          role: value.role,
        });
        if (roleError) {
          toast.error(
            roleError.message ?? "Rolle konnte nicht geändert werden.",
          );
          return;
        }
      }

      if (value.password.length > 0) {
        const { error: passwordError } = await authClient.admin.setUserPassword({
          userId: user.id,
          newPassword: value.password,
        });
        if (passwordError) {
          toast.error(
            passwordError.message ?? "Passwort konnte nicht gesetzt werden.",
          );
          return;
        }
      }

      toast.success("Benutzer aktualisiert.");
      onOpenChange(false);
      onSuccess();
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isCreate) {
      form.reset();
      return;
    }

    if (user) {
      form.reset();
      form.setFieldValue("name", user.name);
      form.setFieldValue("email", user.email);
      form.setFieldValue("password", "");
      form.setFieldValue("role", hasAdminRole(user.role) ? "admin" : "user");
    }
    // Reset only when the sheet opens or the edited user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isCreate, user?.id]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isCreate ? "Benutzer anlegen" : "Benutzer bearbeiten"}
          </SheetTitle>
          <SheetDescription>
            {isCreate
              ? "Neues Konto mit E-Mail und Passwort erstellen."
              : "Profil, Rolle und optional das Passwort aktualisieren."}
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => (
                <TextField
                  field={field}
                  label="Name"
                  autoComplete="off"
                  placeholder="Max Mustermann"
                />
              )}
            </form.Field>
            <form.Field name="email">
              {(field) => (
                <TextField
                  field={field}
                  label="E-Mail"
                  type="email"
                  autoComplete="off"
                  placeholder="max@example.com"
                />
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <PasswordField
                  field={field}
                  label={isCreate ? "Passwort" : "Neues Passwort"}
                  description={
                    isCreate
                      ? undefined
                      : "Leer lassen, um das Passwort nicht zu ändern."
                  }
                  autoComplete="new-password"
                />
              )}
            </form.Field>
            <form.Field name="role">
              {(field) => (
                <SelectField
                  field={field}
                  label="Rolle"
                  options={roleOptions}
                  disabled={isSelf}
                  description={
                    isSelf
                      ? "Du kannst deine eigene Rolle hier nicht ändern."
                      : undefined
                  }
                />
              )}
            </form.Field>
          </FieldGroup>
          <SheetFooter className="px-0">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => onOpenChange(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Speichern…"
                      : isCreate
                        ? "Anlegen"
                        : "Speichern"}
                  </Button>
                </>
              )}
            </form.Subscribe>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
