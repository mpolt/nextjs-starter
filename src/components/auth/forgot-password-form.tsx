"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { TextField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { withDynamicSchema } from "@/lib/form";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    ...withDynamicSchema(forgotPasswordSchema),
    onSubmit: async ({ value }) => {
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error(error.message ?? "Anfrage fehlgeschlagen.");
        return;
      }

      toast.success(
        "Falls ein Konto existiert, wurde ein Reset-Link gesendet (siehe Konsole).",
      );
      form.reset();
    },
  });

  return (
    <AuthCard
      title="Passwort vergessen"
      description="Wir senden dir einen Link zum Zurücksetzen deines Passworts."
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
          <form.Field name="email">
            {(field) => (
              <TextField
                field={field}
                label="E-Mail"
                type="email"
                autoComplete="email"
                placeholder="name@beispiel.de"
              />
            )}
          </form.Field>
        </FieldGroup>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Wird gesendet…" : "Link senden"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  );
}
