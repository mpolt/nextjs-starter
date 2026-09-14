import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { requireGuest } from "@/lib/session";

export default async function ForgotPasswordPage() {
  await requireGuest();

  return <ForgotPasswordForm />;
}
