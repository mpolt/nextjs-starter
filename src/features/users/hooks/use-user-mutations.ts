"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createUser } from "@/features/users/server/create-user"
import { deleteUser } from "@/features/users/server/delete-user"
import { updateUser } from "@/features/users/server/update-user"
import { userKeys } from "@/features/users/queries"
import type {
  CreateUserValues,
  DeleteUserValues,
  UpdateUserValues,
} from "@/features/users/schemas"

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreateUserValues) => {
      const result = await createUser(values)
      if (!result.ok) {
        throw new Error(result.error)
      }
      return result.user
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: UpdateUserValues) => {
      const result = await updateUser(values)
      if (!result.ok) {
        throw new Error(result.error)
      }
      return result.user
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: DeleteUserValues) => {
      const result = await deleteUser(values)
      if (!result.ok) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
