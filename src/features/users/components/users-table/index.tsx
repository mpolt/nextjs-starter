"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTable } from "@tanstack/react-table"
import { PlusIcon } from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/table/data-table"
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton"
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar"
import { UserFormDrawer } from "@/features/users/components/user-form-drawer"
import {
  createUsersColumns,
  usersTableGlobalFilterFn,
} from "@/features/users/components/users-table/columns"
import { useDeleteUser } from "@/features/users/hooks/use-user-mutations"
import { usersQueryOptions } from "@/features/users/queries"
import { dataTableFeatures } from "@/lib/data-table"
import type { UserListItem } from "@/features/users/types"

const emptyUsers: UserListItem[] = []

type UsersTableProps = {
  currentUserId: string
}

export function UsersTable({ currentUserId }: UsersTableProps) {
  const { data, isPending, isError, error, refetch } = useQuery(
    usersQueryOptions()
  )

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null)
  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const deleteMutation = useDeleteUser()

  const columns = useMemo(
    () =>
      createUsersColumns({
        currentUserId,
        onEdit: (user) => {
          setEditingUser(user)
          setDrawerOpen(true)
        },
        onDelete: (user) => {
          setDeleteError(null)
          setUserToDelete(user)
        },
      }),
    [currentUserId]
  )

  const table = useTable(
    {
      features: dataTableFeatures,
      columns,
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

  function openCreateDrawer() {
    setEditingUser(null)
    setDrawerOpen(true)
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return

    setDeleteError(null)

    try {
      await deleteMutation.mutateAsync({ id: userToDelete.id })
      setUserToDelete(null)
    } catch (deleteErr) {
      setDeleteError(
        deleteErr instanceof Error
          ? deleteErr.message
          : "Löschen fehlgeschlagen."
      )
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[28rem] w-full flex-col gap-6">
      <div className="flex shrink-0 items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Userverwaltung
        </h1>
        <Button type="button" onClick={openCreateDrawer}>
          <PlusIcon />
          Nutzer anlegen
        </Button>
      </div>

      {isPending ? (
        <DataTableSkeleton
          columnCount={4}
          filterCount={1}
          cellWidths={["40%", "20%", "20%", "10%"]}
        />
      ) : (
        <DataTable
          table={table}
          emptyMessage="Keine Nutzer gefunden."
          error={
            isError
              ? error instanceof Error
                ? error
                : new Error("Nutzer konnten nicht geladen werden.")
              : null
          }
          onRetry={() => void refetch()}
        >
          <DataTableToolbar
            table={table}
            searchPlaceholder="Nutzer suchen..."
          />
        </DataTable>
      )}

      <UserFormDrawer
        key={editingUser?.id ?? "create"}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        user={editingUser}
      />

      <ConfirmDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setUserToDelete(null)
            setDeleteError(null)
          }
        }}
        title="Nutzer löschen?"
        description={
          <>
            {userToDelete
              ? `${userToDelete.name} (${userToDelete.email}) wird soft-gelöscht und aus der Liste entfernt. Die E-Mail bleibt reserviert.`
              : null}
            {deleteError ? (
              <span className="mt-2 block text-destructive">{deleteError}</span>
            ) : null}
          </>
        }
        confirmLabel="Löschen"
        destructive
        pending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
