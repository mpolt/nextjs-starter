import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs"
import { ThemeMenu } from "@/components/theme-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/features/auth/components/user-menu"

type AppHeaderProps = {
  user: {
    name: string
    email: string
  }
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 bg-background/60 backdrop-blur-md md:h-14">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-1 data-vertical:h-4 data-vertical:self-center"
        />
        <AppBreadcrumbs />
      </div>
      <div className="flex items-center gap-2 px-4">
        <ThemeMenu />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
