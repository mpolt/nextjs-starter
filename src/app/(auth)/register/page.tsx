import { RegisterForm } from "@/components/auth/register-form";
import { requireGuest } from "@/lib/session";

export default async function RegisterPage() {
  await requireGuest();

  return <RegisterForm />;
}
