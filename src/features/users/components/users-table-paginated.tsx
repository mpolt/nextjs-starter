"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTable } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/table/data-table"
import { DataTablePagination } from "@/components/ui/table/data-table-pagination"
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton"
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar"
import {
  createUsersColumns,
  usersTableGlobalFilterFn,
} from "@/features/users/components/users-table/columns"
import { usersQueryOptions } from "@/features/users/queries"
import {
  dataTablePaginationFeatures,
  type DataTableFeatures,
  type DataTablePaginationFeatures,
} from "@/lib/data-table"
import type { UserListItem } from "@/features/users/types"

const emptyUsers: UserListItem[] = []

export function UsersTablePaginated() {
  const { data, isPending, isError, error, refetch } = useQuery(
    usersQueryOptions()
  )

  const columns = useMemo(
    () =>
      createUsersColumns({
        onEdit: () => undefined,
        onDelete: () => undefined,
      }),
    []
  )

  const table = useTable<DataTablePaginationFeatures, UserListItem>(
    {
      features: dataTablePaginationFeatures,
      columns: columns as never,
      data: data ?? emptyUsers,
      getRowId: (row) => row.id,
      globalFilterFn: usersTableGlobalFilterFn,
      getColumnCanGlobalFilter: (column) => column.id === "name",
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
    },
    (state) => ({
      globalFilter: state.globalFilter,
      columnFilters: state.columnFilters,
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
      pagination: state.pagination,
    })
  )

  // Shared table UI is typed against the non-paginated feature set.
  const sharedTable =
    table as unknown as ReturnType<
      typeof useTable<DataTableFeatures, UserListItem>
    >

  if (isPending) {
    return (
      <DataTableSkeleton
        columnCount={4}
        filterCount={1}
        cellWidths={["40%", "20%", "20%", "10%"]}
      />
    )
  }

  return (
    <DataTable
      table={sharedTable}
      emptyMessage="Keine Nutzer gefunden."
      error={
        isError
          ? error instanceof Error
            ? error
            : new Error("Nutzer konnten nicht geladen werden.")
          : null
      }
      onRetry={() => void refetch()}
      actionBar={<DataTablePagination table={table as never} />}
    >
      <DataTableToolbar
        table={sharedTable}
        searchPlaceholder="Nutzer suchen..."
      />
    </DataTable>
  )
}
