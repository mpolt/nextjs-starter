"use client"

import { useQuery } from "@tanstack/react-query"
import { useTable } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/table/data-table"
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton"
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar"
import {
  usersColumns,
  usersTableGlobalFilterFn,
} from "@/features/users/components/users-table/columns"
import { listUsers } from "@/features/users/server/list-users"
import { dataTableFeatures } from "@/lib/data-table"
import type { UserListItem } from "@/features/users/types"

const emptyUsers: UserListItem[] = []

export function UsersTable() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => listUsers(),
  })

  const table = useTable(
    {
      features: dataTableFeatures,
      columns: usersColumns,
      data: data ?? emptyUsers,
      getRowId: (row) => row.id,
      globalFilterFn: usersTableGlobalFilterFn,
      getColumnCanGlobalFilter: (column) => column.id === "name",
    },
    (state) => ({
      globalFilter: state.globalFilter,
      columnFilters: state.columnFilters,
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
    })
  )

  if (isPending) {
    return (
      <DataTableSkeleton
        columnCount={3}
        filterCount={1}
        cellWidths={["40%", "20%", "20%"]}
      />
    )
  }

  return (
    <DataTable
      table={table}
      emptyMessage="Keine Nutzer gefunden."
      error={isError ? (error instanceof Error ? error : new Error("Nutzer konnten nicht geladen werden.")) : null}
      onRetry={() => void refetch()}
    >
      <DataTableToolbar table={table} searchPlaceholder="Nutzer suchen..." />
    </DataTable>
  )
}
