import { RegisterForm } from "@/components/auth/register-form";
import { isGoogleAuthEnabled } from "@/lib/auth-config";
import { requireGuest } from "@/lib/session";

export default async function RegisterPage() {
  await requireGuest();

  return <RegisterForm googleEnabled={isGoogleAuthEnabled()} />;
}
