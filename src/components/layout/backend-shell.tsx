"use client"

import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ImpersonationBanner } from "@/features/auth/components/impersonation-banner"

type BackendShellProps = {
  user: {
    name: string
    email: string
  }
  isAdmin?: boolean
  isImpersonating?: boolean
  children: React.ReactNode
}

export function BackendShell({
  user,
  isAdmin = false,
  isImpersonating = false,
  children,
}: BackendShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          {isImpersonating ? <ImpersonationBanner /> : null}
          <AppHeader user={user} />
          <div className="flex flex-1 flex-col p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
