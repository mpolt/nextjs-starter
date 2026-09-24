"use client"

import { ArrowLeftIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

type BackButtonProps = {
  label?: string
  variant?: "default" | "outline"
  className?: string
}

type SessionNavigation = {
  canGoBack: boolean
  addEventListener: (type: "currententrychange", listener: () => void) => void
  removeEventListener: (
    type: "currententrychange",
    listener: () => void
  ) => void
}

function getSessionNavigation(): SessionNavigation | null {
  if (!("navigation" in window)) return null

  const navigation = window.navigation
  if (
    !navigation ||
    typeof navigation !== "object" ||
    !("canGoBack" in navigation) ||
    typeof navigation.canGoBack !== "boolean"
  ) {
    return null
  }

  return navigation as SessionNavigation
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange)
  const navigation = getSessionNavigation()
  navigation?.addEventListener("currententrychange", onStoreChange)

  return () => {
    window.removeEventListener("popstate", onStoreChange)
    navigation?.removeEventListener("currententrychange", onStoreChange)
  }
}

function hasBackRoute() {
  const navigation = getSessionNavigation()
  if (navigation) return navigation.canGoBack
  return window.history.length > 1
}

export function BackButton({
  label,
  variant = "outline",
  className,
}: BackButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const canGoBack = useSyncExternalStore(
    subscribe,
    () => {
      void pathname
      return hasBackRoute()
    },
    () => false
  )

  if (!canGoBack) return null

  return (
    <Button
      type="button"
      variant={variant}
      size={label ? "default" : "icon"}
      className={className}
      aria-label={label ?? "Zurück"}
      onClick={() => router.back()}
    >
      {label ?? <ArrowLeftIcon />}
    </Button>
  )
}
