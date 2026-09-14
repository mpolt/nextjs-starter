"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  isAdminUserSortField,
  type AdminUserRoleFilter,
  type AdminUserRow,
  type AdminUserSortDirection,
  type AdminUserSortField,
  type AdminUserVerifiedFilter,
} from "@/lib/admin-users";
import { authClient } from "@/lib/auth-client";

import { UserFormSheet } from "./user-form-sheet";
import { UsersTable } from "./users-table";

const roleFilterItems = [
  { label: "Alle Rollen", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
] as const;

const verifiedFilterItems = [
  { label: "Alle Status", value: "all" },
  { label: "Bestätigt", value: "verified" },
  { label: "Unbestätigt", value: "unverified" },
] as const;

type UsersManagementProps = {
  currentUserId: string;
};

export function UsersManagement({ currentUserId }: UsersManagementProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const [roleFilter, setRoleFilter] = useState<AdminUserRoleFilter>("all");
  const [verifiedFilter, setVerifiedFilter] =
    useState<AdminUserVerifiedFilter>("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const sortBy: AdminUserSortField = isAdminUserSortField(sorting[0]?.id ?? "")
    ? (sorting[0]!.id as AdminUserSortField)
    : "createdAt";
  const sortDirection: AdminUserSortDirection = sorting[0]?.desc
    ? "desc"
    : sorting[0]
      ? "asc"
      : "desc";

  const usersQuery = useAdminUsers({
    q: debouncedSearch.trim(),
    sortBy,
    sortDirection,
    role: roleFilter,
    emailVerified: verifiedFilter,
  });

  const users = useMemo(
    () => usersQuery.data?.pages.flatMap((page) => page.users) ?? [],
    [usersQuery.data],
  );
  const total = usersQuery.data?.pages[0]?.total ?? 0;

  const invalidateUsers = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  }, [queryClient]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<AdminUserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = useCallback(() => {
    setSheetMode("create");
    setEditingUser(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((user: AdminUserRow) => {
    setSheetMode("edit");
    setEditingUser(user);
    setSheetOpen(true);
  }, []);

  const handleSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      setSorting((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (next.length > 1) {
          return [next[next.length - 1]!];
        }
        if (next.length === 0) {
          return [{ id: "createdAt", desc: true }];
        }
        return next;
      });
    },
    [],
  );

  const actions = useMemo(
    () => ({
      currentUserId,
      onEdit: openEdit,
      onDelete: setDeleteUser,
      onSetRole: async (userId: string, role: "admin" | "user") => {
        const { error } = await authClient.admin.setRole({ userId, role });
        if (error) {
          toast.error(error.message ?? "Rolle konnte nicht geändert werden.");
          return;
        }
        toast.success(
          role === "admin" ? "Admin-Rolle gesetzt." : "User-Rolle gesetzt.",
        );
        await invalidateUsers();
      },
      onBan: async (userId: string) => {
        const { error } = await authClient.admin.banUser({
          userId,
          banReason: "Gesperrt durch Admin",
        });
        if (error) {
          toast.error(
            error.message ?? "Benutzer konnte nicht gesperrt werden.",
          );
          return;
        }
        toast.success("Benutzer gesperrt.");
        await invalidateUsers();
      },
      onUnban: async (userId: string) => {
        const { error } = await authClient.admin.unbanUser({ userId });
        if (error) {
          toast.error(
            error.message ?? "Benutzer konnte nicht entsperrt werden.",
          );
          return;
        }
        toast.success("Benutzer entsperrt.");
        await invalidateUsers();
      },
      onImpersonate: async (userId: string) => {
        const { error } = await authClient.admin.impersonateUser({ userId });
        if (error) {
          toast.error(error.message ?? "Impersonation fehlgeschlagen.");
          return;
        }
        toast.success("Du siehst die App jetzt als dieser Benutzer.");
        router.push("/dashboard");
        router.refresh();
      },
    }),
    [currentUserId, invalidateUsers, openEdit, router],
  );

  async function confirmDelete() {
    if (!deleteUser) {
      return;
    }
    setDeleting(true);
    const { error } = await authClient.admin.removeUser({
      userId: deleteUser.id,
    });
    setDeleting(false);
    if (error) {
      toast.error(error.message ?? "Benutzer konnte nicht gelöscht werden.");
      return;
    }
    toast.success("Benutzer gelöscht.");
    setDeleteUser(null);
    await invalidateUsers();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Benutzer</h1>
          <p className="text-muted-foreground">
            Konten suchen, anlegen, bearbeiten und verwalten.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Benutzer anlegen
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div>
            <CardTitle>Alle Konten</CardTitle>
            <CardDescription>
              {usersQuery.isLoading ? "Laden…" : `${total} Benutzer`}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name oder E-Mail suchen…"
                className="pl-8"
                aria-label="Benutzer suchen"
              />
            </div>
            <Select
              items={[...roleFilterItems]}
              value={roleFilter}
              onValueChange={(value) => {
                if (value == null) {
                  return;
                }
                setRoleFilter(value as AdminUserRoleFilter);
              }}
            >
              <SelectTrigger className="w-full sm:w-40" aria-label="Rolle filtern">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleFilterItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              items={[...verifiedFilterItems]}
              value={verifiedFilter}
              onValueChange={(value) => {
                if (value == null) {
                  return;
                }
                setVerifiedFilter(value as AdminUserVerifiedFilter);
              }}
            >
              <SelectTrigger
                className="w-full sm:w-44"
                aria-label="Bestätigung filtern"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {verifiedFilterItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            actions={actions}
            hasNextPage={Boolean(usersQuery.hasNextPage)}
            isFetchingNextPage={usersQuery.isFetchingNextPage}
            fetchNextPage={() => {
              void usersQuery.fetchNextPage();
            }}
            isLoading={usersQuery.isLoading}
            isError={usersQuery.isError}
          />
        </CardContent>
      </Card>

      <UserFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        user={editingUser}
        currentUserId={currentUserId}
        onSuccess={() => {
          void invalidateUsers();
        }}
      />

      <AlertDialog
        open={deleteUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteUser(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Benutzer löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteUser
                ? `„${deleteUser.name}“ (${deleteUser.email}) wird dauerhaft gelöscht. Das kann nicht rückgängig gemacht werden.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleting ? "Löschen…" : "Löschen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
