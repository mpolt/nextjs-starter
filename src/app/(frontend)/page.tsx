import { ButtonLink } from "@/components/ui/button-link";
import { getSession } from "@/lib/session";
import { site } from "@/lib/site";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <main className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
          <p className="text-muted-foreground">
            {session
              ? `Angemeldet als ${session.user.name}.`
              : "Melde dich an oder erstelle ein Konto."}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {session ? (
            <ButtonLink href="/dashboard">Zum Dashboard</ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login">Anmelden</ButtonLink>
              <ButtonLink href="/register" variant="outline">
                Registrieren
              </ButtonLink>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
