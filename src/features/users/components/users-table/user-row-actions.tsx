"use client"

import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserListItem } from "@/features/users/types"

type UserRowActionsProps = {
  user: UserListItem
  currentUserId?: string
  onEdit: (user: UserListItem) => void
  onDelete: (user: UserListItem) => void
}

export function UserRowActions({
  user,
  currentUserId,
  onEdit,
  onDelete,
}: UserRowActionsProps) {
  const canDelete = user.id !== currentUserId

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Aktionen für ${user.name}`}
          />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <PencilIcon />
          Bearbeiten
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={!canDelete}
          onClick={() => {
            if (canDelete) onDelete(user)
          }}
        >
          <Trash2Icon />
          Löschen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
