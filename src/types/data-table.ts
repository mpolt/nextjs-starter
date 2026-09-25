import type { DataTableConfig } from "@/config/data-table"
import type { Row, RowData } from "@tanstack/react-table"
import type { ComponentType, SVGProps } from "react"

export type FilterOperator = DataTableConfig["operators"][number]
export type FilterVariant = DataTableConfig["filterVariants"][number]
export type JoinOperator = DataTableConfig["joinOperators"][number]

export interface Option {
  label: string
  value: string
  count?: number
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export type DataTableColumnMeta = {
  label?: string
  placeholder?: string
  variant?: FilterVariant
  options?: Option[]
  range?: [number, number]
  unit?: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export interface DataTableRowAction<TData extends RowData> {
  row: Row<any, TData>
  variant: "update" | "delete"
}

export type { RowData }
