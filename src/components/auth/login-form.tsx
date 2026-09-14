"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { CheckboxField, PasswordField, TextField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { withDynamicSchema } from "@/lib/form";
import { safeRedirectPath } from "@/lib/redirect";
import { loginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirectPath(searchParams.get("redirect"));

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    ...withDynamicSchema(loginSchema),
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
        rememberMe: value.rememberMe,
        callbackURL: redirectTo,
      });

      if (error) {
        if (error.status === 403) {
          toast.error("Bitte bestätige zuerst deine E-Mail-Adresse.");
          router.push(
            `/verify-email?email=${encodeURIComponent(value.email)}`,
          );
          return;
        }
        toast.error(error.message ?? "Anmeldung fehlgeschlagen.");
        return;
      }

      toast.success("Erfolgreich angemeldet.");
      router.push(redirectTo);
      router.refresh();
    },
  });

  return (
    <AuthCard
      title="Anmelden"
      description="Melde dich mit deiner E-Mail-Adresse an."
      footer={
        <p className="text-sm text-muted-foreground">
          Noch kein Konto? <AuthLink href="/register">Registrieren</AuthLink>
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
          <form.Field name="password">
            {(field) => (
              <PasswordField
                field={field}
                label="Passwort"
                autoComplete="current-password"
              />
            )}
          </form.Field>
          <form.Field name="rememberMe">
            {(field) => (
              <CheckboxField field={field} label="Angemeldet bleiben" />
            )}
          </form.Field>
        </FieldGroup>

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Passwort vergessen?
          </Link>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Wird angemeldet…" : "Anmelden"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </AuthCard>
  );
}
