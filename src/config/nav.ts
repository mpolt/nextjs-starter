import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboardIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  adminOnly?: boolean
}

export type BreadcrumbCrumb = {
  title: string
  href?: string
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: UsersIcon,
    adminOnly: true,
  },
  {
    title: "Users Pagination",
    href: "/dashboard/users-pagination",
    icon: UsersIcon,
    adminOnly: true,
  },
  {
    title: "Konto",
    href: "/dashboard/account",
    icon: SettingsIcon,
  },
  {
    title: "Admin",
    href: "/dashboard/admin",
    icon: ShieldIcon,
    adminOnly: true,
  },
]

export function getVisibleNavItems(isAdmin: boolean) {
  return navItems.filter((item) => !item.adminOnly || isAdmin)
}

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function normalizePathname(pathname: string) {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1)
  }

  return pathname
}

function formatSegment(segment: string) {
  const decoded = decodeURIComponent(segment)
  return decoded.charAt(0).toUpperCase() + decoded.slice(1).replace(/-/g, " ")
}

export function getBreadcrumbs(pathname: string): BreadcrumbCrumb[] {
  const normalized = normalizePathname(pathname)

  if (!normalized.startsWith("/dashboard")) {
    return [{ title: "Dashboard", href: "/dashboard" }]
  }

  const exact = navItems.find((item) => item.href === normalized)
  if (exact) {
    return [{ title: exact.title }]
  }

  const parent = [...navItems]
    .filter(
      (item) =>
        normalized === item.href || normalized.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]

  if (parent && parent.href !== normalized) {
    const rest = normalized
      .slice(parent.href.length)
      .split("/")
      .filter(Boolean)

    return [
      { title: parent.title, href: parent.href },
      ...rest.map((segment, index) => {
        const isLast = index === rest.length - 1
        return {
          title: formatSegment(segment),
          href: isLast
            ? undefined
            : `${parent.href}/${rest.slice(0, index + 1).join("/")}`,
        }
      }),
    ]
  }

  const rest = normalized
    .replace(/^\/dashboard\/?/, "")
    .split("/")
    .filter(Boolean)

  return [
    {
      title: "Dashboard",
      href: rest.length > 0 ? "/dashboard" : undefined,
    },
    ...rest.map((segment, index) => {
      const isLast = index === rest.length - 1
      return {
        title: formatSegment(segment),
        href: isLast
          ? undefined
          : `/dashboard/${rest.slice(0, index + 1).join("/")}`,
      }
    }),
  ]
}
