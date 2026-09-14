export const ADMIN_USER_SORT_FIELDS = [
  "name",
  "email",
  "role",
  "createdAt",
  "banned",
] as const;

export type AdminUserSortField = (typeof ADMIN_USER_SORT_FIELDS)[number];

export type AdminUserSortDirection = "asc" | "desc";

export const ADMIN_USER_ROLE_FILTERS = ["all", "admin", "user"] as const;
export type AdminUserRoleFilter = (typeof ADMIN_USER_ROLE_FILTERS)[number];

export const ADMIN_USER_VERIFIED_FILTERS = [
  "all",
  "verified",
  "unverified",
] as const;
export type AdminUserVerifiedFilter =
  (typeof ADMIN_USER_VERIFIED_FILTERS)[number];

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string | null;
  banned: boolean;
  banReason: string | null;
  createdAt: string;
};

export type AdminUsersPage = {
  users: AdminUserRow[];
  total: number;
  nextOffset: number | null;
};

export const ADMIN_USERS_PAGE_SIZE = 40;

export function isAdminUserSortField(value: string): value is AdminUserSortField {
  return (ADMIN_USER_SORT_FIELDS as readonly string[]).includes(value);
}

export function isAdminUserRoleFilter(
  value: string,
): value is AdminUserRoleFilter {
  return (ADMIN_USER_ROLE_FILTERS as readonly string[]).includes(value);
}

export function isAdminUserVerifiedFilter(
  value: string,
): value is AdminUserVerifiedFilter {
  return (ADMIN_USER_VERIFIED_FILTERS as readonly string[]).includes(value);
}
