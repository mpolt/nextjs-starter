"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export type SessionItem = {
  id: string;
  token: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  expiresAt: string | Date;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type SessionsCardProps = {
  sessions: SessionItem[];
  currentSessionToken: string;
  loadError?: boolean;
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SessionsCard({
  sessions,
  currentSessionToken,
  loadError = false,
}: SessionsCardProps) {
  const router = useRouter();

  async function revoke(token: string) {
    const { error } = await authClient.revokeSession({ token });
    if (error) {
      toast.error(error.message ?? "Sitzung konnte nicht beendet werden.");
      return;
    }
    toast.success("Sitzung beendet.");
    router.refresh();
  }

  async function revokeOthers() {
    const { error } = await authClient.revokeOtherSessions();
    if (error) {
      toast.error(error.message ?? "Sitzungen konnten nicht beendet werden.");
      return;
    }
    toast.success("Andere Sitzungen beendet.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Aktive Sitzungen</CardTitle>
          <CardDescription>
            Geräte, auf denen du gerade angemeldet bist.
          </CardDescription>
        </div>
        {sessions.length > 1 ? (
          <Button variant="outline" size="sm" onClick={() => void revokeOthers()}>
            Andere beenden
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {loadError ? (
          <p className="text-sm text-muted-foreground">
            Sitzungen konnten nicht geladen werden. Melde dich erneut an, um
            aktive Geräte zu sehen.
          </p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine Sitzungen gefunden.</p>
        ) : (
          sessions.map((session) => {
            const isCurrent = session.token === currentSessionToken;
            return (
              <div
                key={session.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {isCurrent ? "Diese Sitzung" : "Andere Sitzung"}
                  </p>
                  <p className="text-muted-foreground">
                    Erstellt: {formatDate(session.createdAt)}
                  </p>
                  {session.ipAddress ? (
                    <p className="text-muted-foreground">IP: {session.ipAddress}</p>
                  ) : null}
                  {session.userAgent ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {session.userAgent}
                    </p>
                  ) : null}
                </div>
                {!isCurrent ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void revoke(session.token)}
                  >
                    Beenden
                  </Button>
                ) : null}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
