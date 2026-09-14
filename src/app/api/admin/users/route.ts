import type { NextRequest } from "next/server";
import type { Prisma } from "@/generated/prisma/client";

import {
  ADMIN_USERS_PAGE_SIZE,
  isAdminUserRoleFilter,
  isAdminUserSortField,
  isAdminUserVerifiedFilter,
  type AdminUserSortDirection,
  type AdminUsersPage,
} from "@/lib/admin-users";
import { hasAdminRole } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasAdminRole(session.user.role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const sortByParam = searchParams.get("sortBy") ?? "createdAt";
  const sortBy = isAdminUserSortField(sortByParam) ? sortByParam : "createdAt";
  const sortDirectionParam = searchParams.get("sortDirection");
  const sortDirection: AdminUserSortDirection =
    sortDirectionParam === "asc" ? "asc" : "desc";

  const roleParam = searchParams.get("role") ?? "all";
  const roleFilter = isAdminUserRoleFilter(roleParam) ? roleParam : "all";
  const verifiedParam = searchParams.get("emailVerified") ?? "all";
  const verifiedFilter = isAdminUserVerifiedFilter(verifiedParam)
    ? verifiedParam
    : "all";

  const limitRaw = Number(searchParams.get("limit") ?? ADMIN_USERS_PAGE_SIZE);
  const offsetRaw = Number(searchParams.get("offset") ?? 0);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(Math.trunc(limitRaw), 1), 100)
    : ADMIN_USERS_PAGE_SIZE;
  const offset = Number.isFinite(offsetRaw)
    ? Math.max(Math.trunc(offsetRaw), 0)
    : 0;

  const where: Prisma.UserWhereInput = {};

  if (q) {
    where.OR = [{ name: { contains: q } }, { email: { contains: q } }];
  }

  if (roleFilter === "admin") {
    where.role = { contains: "admin" };
  } else if (roleFilter === "user") {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { role: null },
          { role: { equals: "user" } },
          { role: { equals: "" } },
        ],
      },
    ];
  }

  if (verifiedFilter === "verified") {
    where.emailVerified = true;
  } else if (verifiedFilter === "unverified") {
    where.emailVerified = false;
  }

  const orderBy: Prisma.UserOrderByWithRelationInput = {
    [sortBy]: sortDirection,
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        banned: true,
        banReason: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  const nextOffset = offset + users.length < total ? offset + users.length : null;

  const body: AdminUsersPage = {
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
      createdAt: user.createdAt.toISOString(),
    })),
    total,
    nextOffset,
  };

  return Response.json(body);
}
