"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function ImpersonationBanner() {
  const router = useRouter();

  async function stop() {
    const { error } = await authClient.admin.stopImpersonating();
    if (error) {
      toast.error(error.message ?? "Impersonation konnte nicht beendet werden.");
      return;
    }

    toast.success("Zurück zum Admin-Konto.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-destructive/10 px-4 py-2 text-sm text-destructive">
      <p>Du siehst die App gerade als ein anderer Benutzer.</p>
      <Button variant="outline" size="sm" onClick={() => void stop()}>
        Impersonation beenden
      </Button>
    </div>
  );
}
