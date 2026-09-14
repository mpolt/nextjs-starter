"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { hasAdminRole } from "@/lib/auth-config";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: string | null;
  banned?: boolean | null;
  createdAtLabel: string;
};

type UsersTableProps = {
  users: AdminUserRow[];
  currentUserId: string;
};

function RoleBadge({ role }: { role?: string | null }) {
  const admin = hasAdminRole(role);

  return (
    <span
      className={
        admin
          ? "inline-flex rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
          : "inline-flex rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
      }
    >
      {admin ? "Admin" : "User"}
    </span>
  );
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const router = useRouter();

  async function setRole(userId: string, role: "admin" | "user") {
    const { error } = await authClient.admin.setRole({ userId, role });
    if (error) {
      toast.error(error.message ?? "Rolle konnte nicht geändert werden.");
      return;
    }
    toast.success(role === "admin" ? "Admin-Rolle gesetzt." : "User-Rolle gesetzt.");
    router.refresh();
  }

  async function ban(userId: string) {
    const { error } = await authClient.admin.banUser({
      userId,
      banReason: "Gesperrt durch Admin",
    });
    if (error) {
      toast.error(error.message ?? "Benutzer konnte nicht gesperrt werden.");
      return;
    }
    toast.success("Benutzer gesperrt.");
    router.refresh();
  }

  async function unban(userId: string) {
    const { error } = await authClient.admin.unbanUser({ userId });
    if (error) {
      toast.error(error.message ?? "Benutzer konnte nicht entsperrt werden.");
      return;
    }
    toast.success("Benutzer entsperrt.");
    router.refresh();
  }

  async function impersonate(userId: string) {
    const { error } = await authClient.admin.impersonateUser({ userId });
    if (error) {
      toast.error(error.message ?? "Impersonation fehlgeschlagen.");
      return;
    }
    toast.success("Du siehst die App jetzt als dieser Benutzer.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">E-Mail</th>
            <th className="py-2 pr-4 font-medium">Rolle</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium">Seit</th>
            <th className="py-2 font-medium">
              <span className="sr-only">Aktionen</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const isAdmin = hasAdminRole(user.role);
            const isBanned = Boolean(user.banned);

            return (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="py-3 pr-4 font-medium">{user.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                <td className="py-3 pr-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="py-3 pr-4">
                  {isBanned ? (
                    <span className="text-destructive">Gesperrt</span>
                  ) : user.emailVerified ? (
                    "Aktiv"
                  ) : (
                    "Unbestätigt"
                  )}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {user.createdAtLabel}
                </td>
                <td className="py-3 text-right">
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
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-44">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          disabled={isSelf || isAdmin}
                          onClick={() => void setRole(user.id, "admin")}
                        >
                          Als Admin setzen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={isSelf || !isAdmin}
                          onClick={() => void setRole(user.id, "user")}
                        >
                          Als User setzen
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          disabled={isSelf || isBanned || isAdmin}
                          onClick={() => void impersonate(user.id)}
                        >
                          Impersonieren
                        </DropdownMenuItem>
                        {isBanned ? (
                          <DropdownMenuItem
                            disabled={isSelf}
                            onClick={() => void unban(user.id)}
                          >
                            Entsperren
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            disabled={isSelf}
                            variant="destructive"
                            onClick={() => void ban(user.id)}
                          >
                            Sperren
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
