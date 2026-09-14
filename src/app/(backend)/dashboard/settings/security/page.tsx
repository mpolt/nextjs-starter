import { headers } from "next/headers";

import { ChangePasswordForm } from "@/components/auth/settings-forms";
import { SessionsCard } from "@/components/auth/sessions-card";
import { auth } from "@/lib/auth";
import { requireSession } from "@/lib/session";

export default async function SettingsSecurityPage() {
  const session = await requireSession();
  const requestHeaders = await headers();

  let sessions: Awaited<ReturnType<typeof auth.api.listSessions>> = [];
  let sessionsLoadError = false;

  try {
    sessions = await auth.api.listSessions({
      headers: requestHeaders,
    });
  } catch {
    sessionsLoadError = true;
  }

  return (
    <div className="space-y-6">
      <ChangePasswordForm />
      <SessionsCard
        sessions={sessions ?? []}
        currentSessionToken={session.session.token}
        loadError={sessionsLoadError}
      />
    </div>
  );
}
