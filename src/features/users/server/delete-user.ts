"use server"

import {
  getAuthErrorMessage,
  requireAdminSession,
} from "@/features/users/server/auth"
import {
  deleteUserSchema,
  type DeleteUserValues,
} from "@/features/users/schemas"
import { prisma } from "@/lib/prisma"

export type DeleteUserResult =
  | { ok: true }
  | { ok: false; error: string }

export async function deleteUser(
  input: DeleteUserValues
): Promise<DeleteUserResult> {
  try {
    const session = await requireAdminSession()

    const parsed = deleteUserSchema.safeParse(input)
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Eingabe ungültig.",
      }
    }

    const { id } = parsed.data

    if (id === session.user.id) {
      return {
        ok: false,
        error: "Du kannst dein eigenes Konto nicht löschen.",
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: { id: true },
    })

    if (!user) {
      return {
        ok: false,
        error: "Nutzer wurde nicht gefunden.",
      }
    }

    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      }),
    ])

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: getAuthErrorMessage(error, "Nutzer konnte nicht gelöscht werden."),
    }
  }
}
