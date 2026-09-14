"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminUserRow } from "@/lib/admin-users";
import { hasAdminRole } from "@/lib/auth-config";

import type { UsersTableFeatures } from "./users-table-features";

const columnHelper = createColumnHelper<UsersTableFeatures, AdminUserRow>();

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function RoleBadge({ role }: { role?: string | null }) {
  const admin = hasAdminRole(role);

  return (
    <span
      className={
        admin
          ? "inline-flex rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
          : "inline-flex rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
      }
    >
      {admin ? "Admin" : "User"}
    </span>
  );
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") {
    return <ArrowUp className="size-3.5" />;
  }
  if (sorted === "desc") {
    return <ArrowDown className="size-3.5" />;
  }
  return <ArrowUpDown className="size-3.5 opacity-50" />;
}

export type UsersColumnActions = {
  currentUserId: string;
  onEdit: (user: AdminUserRow) => void;
  onDelete: (user: AdminUserRow) => void;
  onSetRole: (userId: string, role: "admin" | "user") => void;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onImpersonate: (userId: string) => void;
};

export function createUsersColumns(actions: UsersColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-8"
          onClick={column.getToggleSortingHandler()}
        >
          Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-8"
          onClick={column.getToggleSortingHandler()}
        >
          E-Mail
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("role", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-8"
          onClick={column.getToggleSortingHandler()}
        >
          Rolle
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ getValue }) => <RoleBadge role={getValue()} />,
    }),
    columnHelper.accessor("banned", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-8"
          onClick={column.getToggleSortingHandler()}
        >
          Status
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        if (row.original.banned) {
          return <span className="text-destructive">Gesperrt</span>;
        }
        if (row.original.emailVerified) {
          return "Aktiv";
        }
        return "Unbestätigt";
      },
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-8"
          onClick={column.getToggleSortingHandler()}
        >
          Seit
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{formatDate(getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Aktionen</span>,
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = user.id === actions.currentUserId;
        const isAdmin = hasAdminRole(user.role);
        const isBanned = Boolean(user.banned);

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Aktionen für ${user.name}`}
                  />
                }
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => actions.onEdit(user)}>
                    Bearbeiten
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isSelf || isAdmin}
                    onClick={() => actions.onSetRole(user.id, "admin")}
                  >
                    Als Admin setzen
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isSelf || !isAdmin}
                    onClick={() => actions.onSetRole(user.id, "user")}
                  >
                    Als User setzen
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={isSelf || isBanned || isAdmin}
                    onClick={() => actions.onImpersonate(user.id)}
                  >
                    Impersonieren
                  </DropdownMenuItem>
                  {isBanned ? (
                    <DropdownMenuItem
                      disabled={isSelf}
                      onClick={() => actions.onUnban(user.id)}
                    >
                      Entsperren
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      disabled={isSelf}
                      variant="destructive"
                      onClick={() => actions.onBan(user.id)}
                    >
                      Sperren
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    disabled={isSelf}
                    variant="destructive"
                    onClick={() => actions.onDelete(user)}
                  >
                    Löschen
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ]);
}
