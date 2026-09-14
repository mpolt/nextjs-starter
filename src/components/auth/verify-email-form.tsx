"use client";

import { useForm } from "@tanstack/react-form";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { TextField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { withDynamicSchema } from "@/lib/form";
import { resendVerificationSchema } from "@/lib/validations/auth";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const form = useForm({
    defaultValues: {
      email: emailFromQuery,
    },
    ...withDynamicSchema(resendVerificationSchema),
    onSubmit: async ({ value }) => {
      const { error } = await authClient.sendVerificationEmail({
        email: value.email,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message ?? "E-Mail konnte nicht gesendet werden.");
        return;
      }

      toast.success(
        "Bestätigungslink erneut gesendet (siehe Server-Konsole).",
      );
    },
  });

  return (
    <AuthCard
      title="E-Mail bestätigen"
      description="Wir haben dir einen Bestätigungslink geschickt. Schau in die Server-Konsole, solange kein Mail-Provider angebunden ist."
      footer={
        <p className="text-sm text-muted-foreground">
          Bereits bestätigt? <AuthLink href="/login">Anmelden</AuthLink>
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
              {isSubmitting
                ? "Wird gesendet…"
                : "Bestätigungslink erneut senden"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  );
}
