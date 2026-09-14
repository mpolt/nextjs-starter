"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { SocialAuth } from "@/components/auth/social-auth";
import { PasswordField, TextField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { withDynamicSchema } from "@/lib/form";
import { registerSchema } from "@/lib/validations/auth";

type RegisterFormProps = {
  googleEnabled?: boolean;
};

export function RegisterForm({ googleEnabled = false }: RegisterFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    ...withDynamicSchema(registerSchema),
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message ?? "Registrierung fehlgeschlagen.");
        return;
      }

      toast.success("Konto erstellt. Bitte bestätige deine E-Mail.");
      router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
    },
  });

  return (
    <AuthCard
      title="Registrieren"
      description={
        googleEnabled
          ? "Erstelle ein Konto mit Google oder E-Mail und Passwort."
          : "Erstelle ein neues Konto mit E-Mail und Passwort."
      }
      footer={
        <p className="text-sm text-muted-foreground">
          Bereits registriert? <AuthLink href="/login">Anmelden</AuthLink>
        </p>
      }
    >
      <div className="space-y-6">
        <SocialAuth enabled={googleEnabled} callbackURL="/dashboard" />
        <form
        className="space-y-6"
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
                autoComplete="name"
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
              {isSubmitting ? "Wird erstellt…" : "Konto erstellen"}
            </Button>
          )}
        </form.Subscribe>
        </form>
      </div>
    </AuthCard>
  );
}
