import { UsersTable } from "./users-table"

export function UsersView() {
  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[28rem] w-full flex-col gap-6">
      <div className="shrink-0">
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Userverwaltung
        </h1>
      </div>
      <UsersTable />
    </div>
  )
}
