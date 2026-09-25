import { queryOptions } from "@tanstack/react-query"

import { listUsers } from "@/features/users/server/list-users"

export const userKeys = {
  all: ["users"] as const,
}

export function usersQueryOptions() {
  return queryOptions({
    queryKey: userKeys.all,
    queryFn: () => listUsers(),
  })
}
