"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Settings, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { site } from "@/lib/site";

const navItems = [
  {
    title: "Übersicht",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Einstellungen",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

const adminNavItems = [
  {
    title: "Benutzer",
    href: "/dashboard/users",
    icon: Users,
  },
] as const;

type NavItem = {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
};

type AppSidebarProps = {
  isAdmin?: boolean;
};

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: readonly NavItem[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                render={<Link href={item.href} />}
                isActive={isNavActive(pathname, item.href)}
                tooltip={item.title}
              >
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({ isAdmin = false }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard" />}
              size="lg"
              tooltip={site.name}
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                {site.logoLetter}
              </span>
              <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                {site.name}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Navigation" items={navItems} pathname={pathname} />
        {isAdmin ? (
          <NavGroup
            label="Administration"
            items={adminNavItems}
            pathname={pathname}
          />
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Zur Startseite"
            >
              <Home />
              <span className="group-data-[collapsible=icon]:hidden">
                Startseite
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
