export type UserListItem = {
  id: string
  name: string
  email: string
  role: string
  banned: boolean
  emailVerified: boolean
}

export type UserStatus = "active" | "inactive" | "invited"

export function getUserStatus(user: UserListItem): UserStatus {
  if (user.banned) return "inactive"
  if (!user.emailVerified) return "invited"
  return "active"
}

export function parseUserRoles(role: string): string[] {
  return role
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}
