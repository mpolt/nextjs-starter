"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PasswordField, TextField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { withDynamicSchema } from "@/lib/form";
import {
  changePasswordSchema,
  profileSchema,
} from "@/lib/validations/auth";

type ProfileFormProps = {
  defaultName: string;
};

export function ProfileForm({ defaultName }: ProfileFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: defaultName,
    },
    ...withDynamicSchema(profileSchema),
    onSubmit: async ({ value }) => {
      const { error } = await authClient.updateUser({
        name: value.name,
      });

      if (error) {
        toast.error(error.message ?? "Profil konnte nicht gespeichert werden.");
        return;
      }

      toast.success("Profil aktualisiert.");
      router.refresh();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Aktualisiere deinen Anzeigenamen.</CardDescription>
      </CardHeader>
      <CardContent>
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
                />
              )}
            </form.Field>
          </FieldGroup>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Speichern…" : "Speichern"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}

export function ChangePasswordForm() {
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    ...withDynamicSchema(changePasswordSchema),
    onSubmit: async ({ value }) => {
      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message ?? "Passwort konnte nicht geändert werden.");
        return;
      }

      toast.success("Passwort geändert. Andere Sitzungen wurden beendet.");
      form.reset();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passwort ändern</CardTitle>
        <CardDescription>
          Andere aktive Sitzungen werden dabei beendet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="currentPassword">
              {(field) => (
                <PasswordField
                  field={field}
                  label="Aktuelles Passwort"
                  autoComplete="current-password"
                />
              )}
            </form.Field>
            <form.Field name="newPassword">
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
                  label="Neues Passwort bestätigen"
                  autoComplete="new-password"
                />
              )}
            </form.Field>
          </FieldGroup>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Speichern…" : "Passwort ändern"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
