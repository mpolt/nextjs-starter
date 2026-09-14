"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { PasswordField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { withDynamicSchema } from "@/lib/form";
import { resetPasswordSchema } from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tokenError = searchParams.get("error");

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    ...withDynamicSchema(resetPasswordSchema),
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Ungültiger oder fehlender Reset-Token.");
        return;
      }

      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });

      if (error) {
        toast.error(error.message ?? "Passwort konnte nicht gesetzt werden.");
        return;
      }

      toast.success("Passwort aktualisiert. Du kannst dich jetzt anmelden.");
      router.push("/login");
    },
  });

  if (tokenError || !token) {
    return (
      <AuthCard
        title="Link ungültig"
        description="Der Reset-Link ist ungültig oder abgelaufen."
        footer={
          <p className="text-sm text-muted-foreground">
            <AuthLink href="/forgot-password">Neuen Link anfordern</AuthLink>
          </p>
        }
      >
        <p className="text-sm text-muted-foreground">
          Bitte fordere einen neuen Link zum Zurücksetzen an.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Neues Passwort"
      description="Vergib ein neues Passwort für dein Konto."
      footer={
        <p className="text-sm text-muted-foreground">
          Zurück zur <AuthLink href="/login">Anmeldung</AuthLink>
        </p>
      }
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="password">
            {(field) => (
              <PasswordField
                field={field}
                label="Neues Passwort"
                autoComplete="new-password"
                description="Mindestens 8 Zeichen."
              />
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <PasswordField
                field={field}
                label="Passwort bestätigen"
                autoComplete="new-password"
              />
            )}
          </form.Field>
        </FieldGroup>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Wird gespeichert…" : "Passwort speichern"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  );
}
