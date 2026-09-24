"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push("/")
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Zurück"
      onClick={handleBack}
    >
      <ArrowLeftIcon />
    </Button>
  )
}
