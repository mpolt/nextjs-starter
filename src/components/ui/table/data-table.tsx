"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

import { Button } from "@/components/ui/button"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCommonPinningStyles, type DataTableFeatures } from "@/lib/data-table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData extends RowData>
  extends React.ComponentProps<"div"> {
  table: ReactTable<DataTableFeatures, TData, any>
  actionBar?: React.ReactNode
  estimateSize?: number
  emptyMessage?: string
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
}

export function DataTable<TData extends RowData>({
  table,
  actionBar,
  children,
  estimateSize = 52,
  emptyMessage = "Keine Ergebnisse.",
  isLoading = false,
  error,
  onRetry,
  className,
  ...props
}: DataTableProps<TData>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows
  const columnCount = table.getVisibleLeafColumns().length || 1

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateSize,
    overscan: 8,
    getItemKey: (index) => rows[index]?.id ?? index,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const paddingTop = virtualRows.length > 0 ? (virtualRows[0]?.start ?? 0) : 0
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() -
        (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col gap-4", className)}
      {...props}
    >
      {children}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-auto rounded-xl border"
      >
        <table className="w-full caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-10 bg-background [&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="h-11 px-3"
                    style={getCommonPinningStyles({ column: header.column })}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-32 px-3 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      {error.message || "Daten konnten nicht geladen werden."}
                    </p>
                    {onRetry ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                      >
                        Erneut versuchen
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : !isLoading && rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-32 px-3 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {paddingTop > 0 ? (
                  <tr aria-hidden="true">
                    <td colSpan={columnCount} style={{ height: paddingTop }} />
                  </tr>
                ) : null}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index]
                  if (!row) return null

                  return (
                    <TableRow
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-3 py-2"
                          style={getCommonPinningStyles({ column: cell.column })}
                        >
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
                {paddingBottom > 0 ? (
                  <tr aria-hidden="true">
                    <td colSpan={columnCount} style={{ height: paddingBottom }} />
                  </tr>
                ) : null}
              </>
            )}
          </TableBody>
        </table>
      </div>
      {actionBar ? <div className="flex flex-col gap-2.5">{actionBar}</div> : null}
    </div>
  )
}
