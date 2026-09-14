import { AuthNavLinks, UserMenu } from "@/components/auth/user-menu";
import { AccessibilityPreferences } from "@/components/accessibility-preferences";
import { ButtonLink } from "@/components/ui/button-link";
import { hasAdminRole } from "@/lib/auth-config";
import { getSession } from "@/lib/session";
import { site } from "@/lib/site";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border bg-background/80 px-4 py-2 backdrop-blur">
        <ButtonLink href="/" variant="ghost" size="sm">
          {site.name}
        </ButtonLink>
        <div className="flex items-center gap-2">
          {session ? (
            <UserMenu
              user={session.user}
              isAdmin={hasAdminRole(session.user.role)}
            />
          ) : (
            <AuthNavLinks />
          )}
          <AccessibilityPreferences />
        </div>
      </header>
      {children}
    </>
  );
}
