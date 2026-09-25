"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DataTablePaginationProps<TData extends RowData>
  extends React.ComponentProps<"div"> {
  table: ReactTable<any, TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.state.pagination?.pageIndex ?? 0
  const pageSize = table.state.pagination?.pageSize ?? 10
  const pageCount = table.getPageCount()
  const selectedCount = table.getFilteredSelectedRowModel?.().rows.length ?? 0
  const rowCount = table.getFilteredRowModel().rows.length

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-2 overflow-auto p-1 sm:gap-8",
        className
      )}
      {...props}
    >
      <div className="text-sm whitespace-nowrap text-muted-foreground">
        {selectedCount > 0
          ? `${selectedCount} von ${rowCount} Zeile(n) ausgewählt.`
          : `${rowCount} Zeile(n) insgesamt.`}
      </div>
      <div className="flex items-center gap-2 sm:gap-6 lg:gap-8">
        <div className="hidden items-center gap-2 sm:flex">
          <p className="text-sm font-medium whitespace-nowrap">Zeilen pro Seite</p>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-[4.5rem]"
                />
              }
            >
              {pageSize}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-20">
              <DropdownMenuGroup>
                {pageSizeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => table.setPageSize(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
          Seite {pageIndex + 1} von {Math.max(pageCount, 1)}
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            aria-label="Erste Seite"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            type="button"
            aria-label="Vorherige Seite"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            type="button"
            aria-label="Nächste Seite"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            type="button"
            aria-label="Letzte Seite"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
