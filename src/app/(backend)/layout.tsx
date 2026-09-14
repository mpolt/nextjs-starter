import { ImpersonationBanner } from "@/components/auth/impersonation-banner";
import { UserMenu } from "@/components/auth/user-menu";
import { AccessibilityPreferences } from "@/components/accessibility-preferences";
import { AppSidebar } from "@/components/backend/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { hasAdminRole } from "@/lib/auth-config";
import { requireSession } from "@/lib/session";

export default async function BackendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const isAdmin = hasAdminRole(session.user.role);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          {session.session.impersonatedBy ? <ImpersonationBanner /> : null}
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 self-center data-vertical:h-4 data-vertical:self-center"
            />
            <div className="ml-auto flex items-center gap-2">
              <AccessibilityPreferences />
              <UserMenu user={session.user} isAdmin={isAdmin} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
