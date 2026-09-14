"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  useTable,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminUserRow } from "@/lib/admin-users";

import {
  createUsersColumns,
  type UsersColumnActions,
} from "./users-columns";
import { usersTableFeatures } from "./users-table-features";

type UsersTableProps = {
  users: AdminUserRow[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  actions: UsersColumnActions;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isError: boolean;
};

const ROW_HEIGHT = 48;

export function UsersTable({
  users,
  sorting,
  onSortingChange,
  actions,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isLoading,
  isError,
}: UsersTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const columns = useMemo(() => createUsersColumns(actions), [actions]);

  const table = useTable({
    features: usersTableFeatures,
    data: users,
    columns,
    state: { sorting },
    onSortingChange,
    manualSorting: true,
    getRowId: (row) => row.id,
  });

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) {
      return;
    }
    if (
      lastItem.index >= rows.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    rows.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <div
      ref={parentRef}
      className="h-[min(36rem,70vh)] overflow-auto rounded-lg border border-border"
    >
      <table className="w-full min-w-[44rem] caption-bottom text-sm">
        <TableHeader className="sticky top-0 z-10 bg-background [&_tr]:border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                Laden…
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-destructive"
              >
                Benutzerliste konnte nicht geladen werden.
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                Keine Benutzer gefunden.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {virtualItems.length > 0 ? (
                <tr aria-hidden>
                  <td
                    colSpan={columns.length}
                    style={{ height: virtualItems[0]?.start ?? 0, padding: 0 }}
                  />
                </tr>
              ) : null}
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];
                if (!row) {
                  return null;
                }
                return (
                  <TableRow
                    key={row.id}
                    data-index={virtualRow.index}
                    style={{ height: virtualRow.size }}
                  >
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {virtualItems.length > 0 ? (
                <tr aria-hidden>
                  <td
                    colSpan={columns.length}
                    style={{
                      height:
                        virtualizer.getTotalSize() -
                        (virtualItems[virtualItems.length - 1]?.end ?? 0),
                      padding: 0,
                    }}
                  />
                </tr>
              ) : null}
            </>
          )}
        </TableBody>
      </table>
      {isFetchingNextPage ? (
        <p className="py-3 text-center text-xs text-muted-foreground">
          Weitere Benutzer werden geladen…
        </p>
      ) : null}
    </div>
  );
}
