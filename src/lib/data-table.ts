import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from "@tanstack/react-table"
import type { Column, RowData } from "@tanstack/react-table"
import type { CSSProperties } from "react"

import { dataTableConfig } from "@/config/data-table"
import type {
  DataTableColumnMeta,
  FilterOperator,
  FilterVariant,
  Option,
} from "@/types/data-table"

export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
  },
  columnMeta: {} as DataTableColumnMeta,
})

export type DataTableFeatures = typeof dataTableFeatures

export const dataTablePaginationFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
  },
  columnMeta: {} as DataTableColumnMeta,
})

export type DataTablePaginationFeatures = typeof dataTablePaginationFeatures

export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>()
}

export function getCommonPinningStyles(_options?: {
  column?: unknown
}): CSSProperties {
  return {}
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  }

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant)

  return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq")
}

export function getColumnFilterOptions<TData extends RowData, TValue = unknown>(
  column: Column<DataTableFeatures, TData, TValue>,
  rows: Array<{ getValue: (columnId: string) => unknown }>
): Option[] {
  const fromMeta = column.columnDef.meta?.options
  if (fromMeta && fromMeta.length > 0) return fromMeta

  const unique = new Map<string, Option>()
  for (const row of rows) {
    const value = row.getValue(column.id)
    const entries = Array.isArray(value)
      ? value.map(String)
      : String(value ?? "")
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)

    for (const entry of entries) {
      unique.set(entry, { label: entry, value: entry })
    }
  }

  return Array.from(unique.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  )
}

export function arrayIncludesSome(
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue: unknown
) {
  const selected = Array.isArray(filterValue) ? (filterValue as string[]) : []
  if (selected.length === 0) return true

  const raw = row.getValue(columnId)
  const values = Array.isArray(raw)
    ? raw.map(String)
    : String(raw ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)

  return selected.some((value) => values.includes(value))
}

arrayIncludesSome.autoRemove = (value: unknown) =>
  !Array.isArray(value) || value.length === 0
