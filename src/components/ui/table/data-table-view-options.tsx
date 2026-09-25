"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"
import { CheckIcon, Settings2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DataTableFeatures } from "@/lib/data-table"

interface DataTableViewOptionsProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData, any>
}

export function DataTableViewOptions<TData extends RowData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={<Button type="button" variant="outline" className="gap-1.5" />}
      >
        <Settings2Icon />
        Ansicht
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Spalten</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {columns.map((column) => {
            const visible = column.getIsVisible()
            const label = column.columnDef.meta?.label ?? column.id

            return (
              <DropdownMenuItem
                key={column.id}
                className="capitalize"
                onClick={(event) => {
                  event.preventDefault()
                  column.toggleVisibility(!visible)
                }}
              >
                <span className="flex size-4 items-center justify-center">
                  {visible ? <CheckIcon className="size-4" /> : null}
                </span>
                {label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
