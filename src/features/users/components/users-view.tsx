import { UsersTable } from "./users-table"

type UsersViewProps = {
  currentUserId: string
}

export function UsersView({ currentUserId }: UsersViewProps) {
  return <UsersTable currentUserId={currentUserId} />
}
