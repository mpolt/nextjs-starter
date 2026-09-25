import "server-only"

import { headers } from "next/headers"

import { hasAdminRole } from "@/features/auth/roles"
import { auth } from "@/features/auth/server"
import { getSession } from "@/features/auth/session"

export async function requireAdminSession() {
  const session = await getSession()

  if (!session) {
    throw new Error("Nicht angemeldet.")
  }

  const role = (session.user as { role?: string | string[] }).role

  if (!hasAdminRole(role)) {
    throw new Error("Keine Berechtigung.")
  }

  return session
}

export async function getRequestHeaders() {
  return await headers()
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message
  }

  return fallback
}

export { auth }
