"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const settingsNavItems = [
  {
    title: "Profil",
    href: "/dashboard/settings/profile",
  },
  {
    title: "Sicherheit",
    href: "/dashboard/settings/security",
  },
] as const;

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Einstellungen" className="flex flex-wrap gap-1">
      {settingsNavItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: isActive ? "secondary" : "ghost",
                size: "sm",
              }),
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
