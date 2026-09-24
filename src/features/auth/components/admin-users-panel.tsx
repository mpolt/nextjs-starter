"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { authClient } from "@/features/auth/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AdminUser = {
  id: string
  name: string
  email: string
  role?: string | string[] | null
  banned?: boolean | null
  banReason?: string | null
  createdAt: Date | string
}

const PAGE_SIZE = 10

function roleLabel(role: string | string[] | null | undefined) {
  if (!role) return "user"
  return Array.isArray(role) ? role.join(", ") : role
}

export function AdminUsersPanel({ currentUserId }: { currentUserId: string }) {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [banReasonByUser, setBanReasonByUser] = useState<Record<string, string>>(
    {}
  )
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: listError } = await authClient.admin.listUsers({
      query: {
        limit: PAGE_SIZE,
        offset,
        sortBy: "createdAt",
        sortDirection: "desc",
        ...(search
          ? {
              searchValue: search,
              searchField: "email" as const,
              searchOperator: "contains" as const,
            }
          : {}),
      },
    })

    setLoading(false)

    if (listError) {
      setError(listError.message ?? "Nutzer konnten nicht geladen werden.")
      return
    }

    setUsers((data?.users ?? []) as AdminUser[])
    setTotal(data?.total ?? 0)
  }, [offset, search])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  async function setRole(userId: string, role: "user" | "admin") {
    setPendingUserId(userId)
    setActionError(null)
    const { error: roleError } = await authClient.admin.setRole({
      userId,
      role,
    })
    setPendingUserId(null)

    if (roleError) {
      setActionError(roleError.message ?? "Rolle konnte nicht gesetzt werden.")
      return
    }

    void loadUsers()
  }

  async function banUser(userId: string) {
    setPendingUserId(userId)
    setActionError(null)
    const { error: banError } = await authClient.admin.banUser({
      userId,
      banReason: banReasonByUser[userId] || "Vom Admin gesperrt",
    })
    setPendingUserId(null)

    if (banError) {
      setActionError(banError.message ?? "Nutzer konnte nicht gesperrt werden.")
      return
    }

    void loadUsers()
  }

  async function unbanUser(userId: string) {
    setPendingUserId(userId)
    setActionError(null)
    const { error: unbanError } = await authClient.admin.unbanUser({ userId })
    setPendingUserId(null)

    if (unbanError) {
      setActionError(
        unbanError.message ?? "Sperre konnte nicht aufgehoben werden."
      )
      return
    }

    void loadUsers()
  }

  async function impersonate(userId: string) {
    setPendingUserId(userId)
    setActionError(null)
    const { error: impersonateError } =
      await authClient.admin.impersonateUser({ userId })
    setPendingUserId(null)

    if (impersonateError) {
      setActionError(
        impersonateError.message ?? "Impersonation fehlgeschlagen."
      )
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Admin
        </h1>
        <p className="text-muted-foreground">
          Nutzer verwalten, Rollen setzen, sperren und impersonieren.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nutzer</CardTitle>
          <CardDescription>
            {total} Nutzer insgesamt
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault()
              setOffset(0)
              setSearch(searchInput.trim())
            }}
          >
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="admin-search">Suche (E-Mail)</Label>
              <Input
                id="admin-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="name@example.com"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit">Suchen</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchInput("")
                  setSearch("")
                  setOffset(0)
                }}
              >
                Zurücksetzen
              </Button>
            </div>
          </form>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {actionError ? (
            <p className="text-sm text-destructive">{actionError}</p>
          ) : null}

          {loading ? (
            <p className="text-sm text-muted-foreground">Laden…</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Nutzer gefunden.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {users.map((user) => {
                const isSelf = user.id === currentUserId
                const isAdmin = roleLabel(user.role)
                  .split(",")
                  .map((entry) => entry.trim())
                  .includes("admin")
                const pending = pendingUserId === user.id

                return (
                  <li
                    key={user.id}
                    className="flex flex-col gap-3 rounded-lg border p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">
                        {user.name}
                        {isSelf ? " (du)" : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rolle: {roleLabel(user.role)}
                        {user.banned ? " · gesperrt" : ""}
                        {user.banned && user.banReason
                          ? ` (${user.banReason})`
                          : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={pending || isSelf || isAdmin}
                        onClick={() => void setRole(user.id, "admin")}
                      >
                        Admin machen
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={pending || isSelf || !isAdmin}
                        onClick={() => void setRole(user.id, "user")}
                      >
                        Zu User
                      </Button>
                      {user.banned ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={pending || isSelf}
                          onClick={() => void unbanUser(user.id)}
                        >
                          Entsperren
                        </Button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <Input
                            className="h-8 w-40"
                            placeholder="Sperrgrund"
                            value={banReasonByUser[user.id] ?? ""}
                            onChange={(event) =>
                              setBanReasonByUser((prev) => ({
                                ...prev,
                                [user.id]: event.target.value,
                              }))
                            }
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={pending || isSelf}
                            onClick={() => void banUser(user.id)}
                          >
                            Sperren
                          </Button>
                        </div>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        disabled={pending || isSelf || isAdmin}
                        onClick={() => void impersonate(user.id)}
                      >
                        Impersonieren
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Seite {currentPage} von {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Zurück
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={offset + PAGE_SIZE >= total}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Weiter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
