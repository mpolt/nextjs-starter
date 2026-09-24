import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { ThemeMenu } from "@/components/theme-menu"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-3xl font-medium tracking-tight">
          Next.js Starter
        </h1>
        <p className="max-w-md text-muted-foreground">
          Auth mit Better Auth, TanStack Form und Zod ist verdrahtet.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/login" className={cn(buttonVariants())}>
          Anmelden
        </Link>
        <Link
          href="/register"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Registrieren
        </Link>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "secondary" }))}
        >
          Dashboard
        </Link>
        <ThemeMenu />
      </div>
    </main>
  )
}
