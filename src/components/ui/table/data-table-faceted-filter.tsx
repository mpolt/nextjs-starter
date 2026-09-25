"use client"

import type { Column, RowData } from "@tanstack/react-table"
import { CheckIcon, CirclePlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import type { Option } from "@/types/data-table"

interface DataTableFacetedFilterProps<
  TData extends RowData,
  TValue = unknown,
> {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
  options: Option[]
  multiple?: boolean
}

export function DataTableFacetedFilter<
  TData extends RowData,
  TValue = unknown,
>({
  column,
  title,
  options,
  multiple = true,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const filterValue = column.getFilterValue()
  const selectedValues = new Set(
    Array.isArray(filterValue) ? (filterValue as string[]) : []
  )

  function toggleOption(option: Option, isSelected: boolean) {
    if (multiple) {
      const next = new Set(selectedValues)
      if (isSelected) next.delete(option.value)
      else next.add(option.value)
      const values = Array.from(next)
      column.setFilterValue(values.length > 0 ? values : undefined)
      return
    }

    column.setFilterValue(isSelected ? undefined : [option.value])
  }

  const selectedLabels = options.filter((option) =>
    selectedValues.has(option.value)
  )

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={<Button type="button" variant="outline" className="gap-1.5" />}
      >
        <CirclePlusIcon />
        {title}
        {selectedValues.size > 0 ? (
          <Badge variant="secondary" className="rounded-md px-1.5 font-normal">
            {selectedValues.size > 2
              ? `${selectedValues.size} gewählt`
              : selectedLabels.map((option) => option.label).join(", ")}
          </Badge>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Nach {title} filtern</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {options.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              Keine Optionen
            </p>
          ) : (
            options.map((option) => {
              const isSelected = selectedValues.has(option.value)
              const Icon = option.icon

              return (
                <DropdownMenuItem
                  key={option.value}
                  className="capitalize"
                  onClick={(event) => {
                    event.preventDefault()
                    toggleOption(option, isSelected)
                  }}
                >
                  <span className="flex size-4 items-center justify-center">
                    {isSelected ? <CheckIcon className="size-4" /> : null}
                  </span>
                  {Icon ? <Icon /> : null}
                  {option.label}
                  {option.count != null ? (
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                      {option.count}
                    </span>
                  ) : null}
                </DropdownMenuItem>
              )
            })
          )}
        </DropdownMenuGroup>
        {selectedValues.size > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => column.setFilterValue(undefined)}
                className="justify-center"
              >
                Filter zurücksetzen
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
