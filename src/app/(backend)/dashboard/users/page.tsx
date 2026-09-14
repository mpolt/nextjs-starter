import { headers } from "next/headers";

import { UsersTable } from "@/components/backend/users-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/session";

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default async function UsersPage() {
  const session = await requireAdmin();
  const requestHeaders = await headers();

  let users: Awaited<ReturnType<typeof auth.api.listUsers>>["users"] = [];
  let loadError = false;

  try {
    const result = await auth.api.listUsers({
      query: {
        limit: 100,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
      headers: requestHeaders,
    });
    users = result.users;
  } catch {
    loadError = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Benutzer</h1>
        <p className="text-muted-foreground">
          Rollen setzen, Konten sperren oder als Benutzer impersonieren.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Alle Konten</CardTitle>
          <CardDescription>
            Sichtbar nur für Admins. Der erste Admin entsteht über{" "}
            <code className="text-foreground">ADMIN_EMAIL</code> in der{" "}
            <code className="text-foreground">.env</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadError ? (
            <p className="text-sm text-destructive">
              Benutzerliste konnte nicht geladen werden.
            </p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Benutzer.</p>
          ) : (
            <UsersTable
              users={users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                role: user.role,
                banned: user.banned,
                createdAtLabel: formatDate(user.createdAt),
              }))}
              currentUserId={session.user.id}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
