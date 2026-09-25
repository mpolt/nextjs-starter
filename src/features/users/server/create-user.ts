"use server"

import {
  auth,
  getAuthErrorMessage,
  getRequestHeaders,
  requireAdminSession,
} from "@/features/users/server/auth"
import {
  createUserSchema,
  type CreateUserValues,
} from "@/features/users/schemas"
import type { UserListItem } from "@/features/users/types"

export type UserActionResult =
  | { ok: true; user: UserListItem }
  | { ok: false; error: string }

export async function createUser(
  input: CreateUserValues
): Promise<UserActionResult> {
  try {
    await requireAdminSession()

    const parsed = createUserSchema.safeParse(input)
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Eingabe ungültig.",
      }
    }

    const { name, email, password, role } = parsed.data

    const result = await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role,
        data: {
          emailVerified: true,
        },
      },
      headers: await getRequestHeaders(),
    })

    const user = result.user

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
      error: getAuthErrorMessage(error, "Nutzer konnte nicht angelegt werden."),
    }
  }
}
