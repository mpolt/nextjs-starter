"use client"

import type { Column, ReactTable, RowData } from "@tanstack/react-table"
import { XIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/ui/table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/ui/table/data-table-view-options"
import {
  getColumnFilterOptions,
  type DataTableFeatures,
} from "@/lib/data-table"
import { cn } from "@/lib/utils"

interface DataTableToolbarProps<TData extends RowData>
  extends React.ComponentProps<"div"> {
  table: ReactTable<DataTableFeatures, TData, any>
  searchPlaceholder?: string
}

export function DataTableToolbar<TData extends RowData>({
  table,
  searchPlaceholder = "Suchen...",
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    (table.state.columnFilters?.length ?? 0) > 0 ||
    Boolean(table.state.globalFilter)

  const rows = table.getCoreRowModel().flatRows
  const columns = table.getAllLeafColumns().filter((column) => column.getCanFilter())

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        className
      )}
      {...props}
    >
      <Input
        value={String(table.state.globalFilter ?? "")}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        placeholder={searchPlaceholder}
        className="sm:max-w-xs"
        aria-label={searchPlaceholder}
      />

      {columns.map((column) => (
        <DataTableToolbarFilter
          key={column.id}
          column={column}
          rows={rows}
        />
      ))}

      {isFiltered ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            table.resetColumnFilters()
            table.resetGlobalFilter()
          }}
        >
          <XIcon />
          Zurücksetzen
        </Button>
      ) : null}

      {children}

      <div className="sm:ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

function DataTableToolbarFilter<TData extends RowData, TValue = unknown>({
  column,
  rows,
}: {
  column: Column<DataTableFeatures, TData, TValue>
  rows: Array<{ getValue: (columnId: string) => unknown }>
}) {
  const variant = column.columnDef.meta?.variant
  const title = column.columnDef.meta?.label ?? column.id

  if (variant === "text") {
    return (
      <Input
        value={String(column.getFilterValue() ?? "")}
        onChange={(event) => column.setFilterValue(event.target.value)}
        placeholder={column.columnDef.meta?.placeholder ?? title}
        className="h-8 w-40 lg:w-56"
      />
    )
  }

  if (variant === "select" || variant === "multiSelect") {
    return (
      <DataTableFacetedFilter
        column={column}
        title={title}
        options={getColumnFilterOptions(column, rows)}
        multiple={variant === "multiSelect"}
      />
    )
  }

  return null
}
