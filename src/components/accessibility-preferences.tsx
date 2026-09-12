"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Contrast, Monitor, Moon, Sun } from "lucide-react";

import { useContrast } from "@/components/contrast-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccessibilityPreferences() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { contrast, setContrast } = useContrast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const ThemeIcon =
    !mounted || theme === "system"
      ? Monitor
      : resolvedTheme === "dark"
        ? Moon
        : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="relative"
            aria-label="Darstellungseinstellungen"
            disabled={!mounted}
          />
        }
      >
        <ThemeIcon />
        {mounted && contrast === "high" ? (
          <Contrast className="absolute size-3 translate-x-2.5 translate-y-2.5" />
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Farbschema</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={mounted ? (theme ?? "system") : "system"}
            onValueChange={setTheme}
          >
            <DropdownMenuRadioItem value="system">
              <Monitor />
              System
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="light">
              <Sun />
              Hell
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon />
              Dunkel
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Kontrast</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={contrast}
            onValueChange={(value) => {
              if (value === "default" || value === "high") {
                setContrast(value);
              }
            }}
          >
            <DropdownMenuRadioItem value="default">
              Standard
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="high">
              <Contrast />
              Hoch
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
