import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { isGoogleAuthEnabled } from "@/lib/auth-config";
import { requireGuest } from "@/lib/session";

export default async function LoginPage() {
  await requireGuest();
  const googleEnabled = isGoogleAuthEnabled();

  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Laden…</div>}>
      <LoginForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
