"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  ADMIN_USERS_PAGE_SIZE,
  type AdminUserRoleFilter,
  type AdminUserSortDirection,
  type AdminUserSortField,
  type AdminUserVerifiedFilter,
  type AdminUsersPage,
} from "@/lib/admin-users";

export type AdminUsersQueryParams = {
  q: string;
  sortBy: AdminUserSortField;
  sortDirection: AdminUserSortDirection;
  role: AdminUserRoleFilter;
  emailVerified: AdminUserVerifiedFilter;
};

export const adminUsersQueryKey = (params: AdminUsersQueryParams) =>
  [
    "admin-users",
    params.q,
    params.sortBy,
    params.sortDirection,
    params.role,
    params.emailVerified,
  ] as const;

async function fetchAdminUsers(
  params: AdminUsersQueryParams & { offset: number },
): Promise<AdminUsersPage> {
  const search = new URLSearchParams({
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
    limit: String(ADMIN_USERS_PAGE_SIZE),
    offset: String(params.offset),
  });
  if (params.q) {
    search.set("q", params.q);
  }
  if (params.role !== "all") {
    search.set("role", params.role);
  }
  if (params.emailVerified !== "all") {
    search.set("emailVerified", params.emailVerified);
  }

  const response = await fetch(`/api/admin/users?${search.toString()}`);
  if (!response.ok) {
    throw new Error("Benutzerliste konnte nicht geladen werden.");
  }
  return response.json() as Promise<AdminUsersPage>;
}

export function useAdminUsers(params: AdminUsersQueryParams) {
  return useInfiniteQuery({
    queryKey: adminUsersQueryKey(params),
    queryFn: ({ pageParam }) =>
      fetchAdminUsers({
        ...params,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
}
