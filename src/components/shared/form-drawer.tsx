"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type FormDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  formId: string
  submitLabel?: string
  cancelLabel?: string
  pending?: boolean
}

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  formId,
  submitLabel = "Speichern",
  cancelLabel = "Abbrechen",
  pending = false,
}: FormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6">
          {children}
        </div>

        <SheetFooter className="flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button type="submit" form={formId} disabled={pending}>
            {pending ? "Speichern…" : submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
