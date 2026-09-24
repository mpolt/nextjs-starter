import "server-only"

import { headers } from "next/headers"

import { auth } from "@/features/auth/server"

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}
