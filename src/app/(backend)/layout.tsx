import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

import { SignOutButton } from "@/features/auth/components/sign-out-button"
import { getSession } from "@/features/auth/session"
import { ThemeMenu } from "@/components/theme-menu"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

type BackendLayoutProps = {
  children: React.ReactNode
}

export default async function BackendLayout({ children }: BackendLayoutProps) {
  const session = await getSession()
  const headerStore = await headers()
  const pathname =
    headerStore.get("x-pathname") ??
    headerStore.get("x-url") ??
    "/dashboard"

  if (!session) {
    const callbackUrl = encodeURIComponent(pathname)
    redirect(`/login?callbackUrl=${callbackUrl}`)
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Button>
            <Link href="/">
              <HomeIcon className="h-4 w-4" />
            </Link>
          </Button>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{session.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {session.user.email}
          </span>
        </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeMenu />
          <SignOutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col p-6">{children}</main>
    </div>
  )
}
