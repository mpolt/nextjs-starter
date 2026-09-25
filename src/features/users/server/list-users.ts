"use server"

import { hasAdminRole } from "@/features/auth/roles"
import { getSession } from "@/features/auth/session"
import type { UserListItem } from "@/features/users/types"
import { prisma } from "@/lib/prisma"

export async function listUsers(): Promise<UserListItem[]> {
  const session = await getSession()

  if (!session) {
    throw new Error("Nicht angemeldet.")
  }

  const role = (session.user as { role?: string | string[] }).role

  if (!hasAdminRole(role)) {
    throw new Error("Keine Berechtigung.")
  }

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      emailVerified: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return users
}
