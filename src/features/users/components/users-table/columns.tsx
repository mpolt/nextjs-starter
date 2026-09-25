"use client"

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import {
  arrayIncludesSome,
  createDataTableColumnHelper,
} from "@/lib/data-table"
import { cn } from "@/lib/utils"
import {
  getUserStatus,
  parseUserRoles,
  type UserListItem,
} from "@/features/users/types"

const helper = createDataTableColumnHelper<UserListItem>()

const statusLabels = {
  active: "Aktiv",
  inactive: "Inaktiv",
  invited: "Eingeladen",
} as const

export function usersTableGlobalFilterFn(
  row: { original: UserListItem },
  _columnId: string,
  filterValue: unknown
) {
  const query = String(filterValue ?? "")
    .trim()
    .toLowerCase()

  if (!query) return true

  const user = row.original
  return (
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
}

export const usersColumns = helper.columns([
  helper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-0.5 py-0.5">
        <span className="truncate font-medium text-foreground">
          {row.original.name}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
    sortFn: "alphanumeric",
    enableColumnFilter: false,
    meta: {
      label: "Name",
      placeholder: "Nutzer suchen...",
    },
  }),
  helper.accessor("role", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rolle" />
    ),
    cell: ({ getValue }) => {
      const roles = parseUserRoles(String(getValue() ?? ""))
      if (roles.length === 0) {
        return (
          <Badge variant="outline" className="font-normal capitalize">
            user
          </Badge>
        )
      }

      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge
              key={role}
              variant="outline"
              className="font-normal capitalize"
            >
              {role}
            </Badge>
          ))}
        </div>
      )
    },
    enableSorting: false,
    enableGlobalFilter: false,
    filterFn: arrayIncludesSome,
    meta: {
      label: "Rollen",
      variant: "multiSelect",
    },
  }),
  helper.accessor((row) => getUserStatus(row), {
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={cn(
            "font-normal",
            status === "active" &&
              "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {statusLabels[status]}
        </Badge>
      )
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: {
      label: "Status",
    },
  }),
])
