export function hasAdminRole(role: string | string[] | undefined | null) {
  if (!role) {
    return false
  }

  const roles = Array.isArray(role) ? role : role.split(",")
  return roles.map((entry) => entry.trim()).includes("admin")
}
