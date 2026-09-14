import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { requireGuest } from "@/lib/session";

export default async function LoginPage() {
  await requireGuest();

  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Laden…</div>}>
      <LoginForm />
    </Suspense>
  );
}
