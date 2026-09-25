"use client"

import type { Column } from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  EyeOffIcon,
  XIcon,
} from "lucide-react"

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
import { cn } from "@/lib/utils"
import type { RowData } from "@tanstack/react-table"

interface DataTableColumnHeaderProps<
  TData extends RowData,
  TValue = unknown,
> extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
}

export function DataTableColumnHeader<
  TData extends RowData,
  TValue = unknown,
>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return (
      <span className={cn("font-medium text-muted-foreground uppercase", className)}>
        {title}
      </span>
    )
  }

  const sorted = column.getIsSorted()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "-ml-2 h-8 gap-1.5 px-2 font-medium text-muted-foreground uppercase",
              className
            )}
          />
        }
        {...props}
      >
        {title}
        {column.getCanSort() ? (
          sorted === "desc" ? (
            <ArrowDownIcon className="size-3.5" />
          ) : sorted === "asc" ? (
            <ArrowUpIcon className="size-3.5" />
          ) : (
            <ArrowUpDownIcon className="size-3.5 opacity-60" />
          )
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {column.getCanSort() ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sortieren</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUpIcon />
              Aufsteigend
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDownIcon />
              Absteigend
            </DropdownMenuItem>
            {sorted ? (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <XIcon />
                Zurücksetzen
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuGroup>
        ) : null}
        {column.getCanSort() && column.getCanHide() ? <DropdownMenuSeparator /> : null}
        {column.getCanHide() ? (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOffIcon />
              Ausblenden
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
