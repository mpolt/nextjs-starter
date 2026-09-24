"use client"

import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ErrorStateProps = {
  error: Error & { digest?: string }
  reset: () => void
  homeHref?: string
  homeLabel?: string
  className?: string
}

export function ErrorState({
  error,
  reset,
  homeHref = "/",
  homeLabel = "Zur Startseite",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Etwas ist schiefgelaufen
        </h1>
        <p className="max-w-md text-muted-foreground">
          Die Seite konnte nicht geladen werden. Du kannst es erneut versuchen
          oder zurücknavigieren.
        </p>
        {process.env.NODE_ENV === "development" && error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">
            Digest: {error.digest}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          Erneut versuchen
        </Button>
        <Link
          href={homeHref}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          {homeLabel}
        </Link>
      </div>
    </div>
  )
}
