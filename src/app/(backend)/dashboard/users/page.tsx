import { UsersManagement } from "@/components/backend/users/users-management";
import { requireAdmin } from "@/lib/session";

export default async function UsersPage() {
  const session = await requireAdmin();

  return <UsersManagement currentUserId={session.user.id} />;
}
