"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableSkeletonProps extends React.ComponentProps<"div"> {
  columnCount: number
  rowCount?: number
  filterCount?: number
  cellWidths?: string[]
  withViewOptions?: boolean
  withPagination?: boolean
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 8,
  filterCount = 0,
  cellWidths = ["auto"],
  withViewOptions = true,
  withPagination = false,
  className,
  ...props
}: DataTableSkeletonProps) {
  const widths = Array.from(
    { length: columnCount },
    (_, index) => cellWidths[index % cellWidths.length] ?? "auto"
  )

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-4", className)} {...props}>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-56" />
        {Array.from({ length: filterCount }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24" />
        ))}
        {withViewOptions ? <Skeleton className="ml-auto h-8 w-24" /> : null}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border">
        <table className="w-full caption-bottom text-sm">
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={index} className="h-11 px-3">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, cellIndex) => (
                  <TableCell key={cellIndex} className="px-3 py-3">
                    <Skeleton
                      className="h-4"
                      style={{ width: widths[cellIndex] }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

      {withPagination ? (
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
      ) : null}
    </div>
  )
}
