import { getSession } from "@/features/auth/session"

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <h1 className="font-heading text-2xl font-medium tracking-tight">
        Dashboard
      </h1>
      <p className="text-muted-foreground">
        Willkommen zurück{session?.user.name ? `, ${session.user.name}` : ""}.
        Diese Seite ist durch den Proxy und das Backend-Layout geschützt.
      </p>
      <dl className="grid gap-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">E-Mail</dt>
          <dd>{session?.user.email}</dd>
        </div>
      </dl>
    </div>
  )
}
