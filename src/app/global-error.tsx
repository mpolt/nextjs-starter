"use client"

import { ErrorState } from "@/components/states/error-state"

import "./globals.css"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="de">
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <main className="flex flex-1 flex-col px-4 py-10">
          <ErrorState
            error={error}
            reset={reset}
            homeHref="/"
            homeLabel="Zur Startseite"
            className="flex-1"
          />
        </main>
      </body>
    </html>
  )
}
