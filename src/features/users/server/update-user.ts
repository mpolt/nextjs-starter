"use server"

import {
  auth,
  getAuthErrorMessage,
  getRequestHeaders,
  requireAdminSession,
} from "@/features/users/server/auth"
import {
  updateUserSchema,
  type UpdateUserValues,
} from "@/features/users/schemas"
import type { UserListItem } from "@/features/users/types"
import type { UserActionResult } from "@/features/users/server/create-user"

export async function updateUser(
  input: UpdateUserValues
): Promise<UserActionResult> {
  try {
    await requireAdminSession()

    const parsed = updateUserSchema.safeParse(input)
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Eingabe ungültig.",
      }
    }

    const { id, name, email, role } = parsed.data

    const user = await auth.api.adminUpdateUser({
      body: {
        userId: id,
        data: {
          name,
          email,
          role,
        },
      },
      headers: await getRequestHeaders(),
    })

    return {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: String(user.role ?? role),
        banned: Boolean(user.banned),
        emailVerified: Boolean(user.emailVerified),
      },
    }
  } catch (error) {
    return {
      ok: false,
      error: getAuthErrorMessage(
        error,
        "Nutzer konnte nicht aktualisiert werden."
      ),
    }
  }
}
