"use client"

import { ErrorState } from "@/components/states/error-state"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10">
      <ErrorState
        error={error}
        reset={reset}
        homeHref="/"
        homeLabel="Zur Startseite"
        className="flex-1"
      />
    </main>
  )
}
