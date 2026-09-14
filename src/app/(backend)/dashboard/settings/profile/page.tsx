import { ProfileForm } from "@/components/auth/settings-forms";
import { requireSession } from "@/lib/session";

export default async function SettingsProfilePage() {
  const session = await requireSession();

  return <ProfileForm defaultName={session.user.name} />;
}
