import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Willkommen zurück, {session.user.name}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Konto</CardTitle>
          <CardDescription>Deine aktuelle Session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span>{" "}
            {session.user.name}
          </p>
          <p>
            <span className="text-muted-foreground">E-Mail:</span>{" "}
            {session.user.email}
          </p>
          <p>
            <span className="text-muted-foreground">Verifiziert:</span>{" "}
            {session.user.emailVerified ? "Ja" : "Nein"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
