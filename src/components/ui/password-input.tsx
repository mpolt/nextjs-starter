"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_HIDE_AFTER_MS = 8_000;

type PasswordInputProps = Omit<
  React.ComponentProps<"input">,
  "type"
> & {
  /** Auto-hide after revealing. `0` or `false` disables the timer. Default: 8s. */
  hideAfterMs?: number | false;
};

function PasswordInput({
  className,
  disabled,
  hideAfterMs = DEFAULT_HIDE_AFTER_MS,
  onBlur,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const hideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearHideTimeout = React.useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const hide = React.useCallback(() => {
    clearHideTimeout();
    setVisible(false);
  }, [clearHideTimeout]);

  const show = React.useCallback(() => {
    clearHideTimeout();
    setVisible(true);

    const ms =
      hideAfterMs === false || hideAfterMs === 0 ? null : hideAfterMs;

    if (ms !== null) {
      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        hideTimeoutRef.current = null;
      }, ms);
    }
  }, [clearHideTimeout, hideAfterMs]);

  React.useEffect(() => clearHideTimeout, [clearHideTimeout]);

  function toggleVisibility() {
    if (visible) {
      hide();
    } else {
      show();
    }
  }

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-9", className)}
        onBlur={(event) => {
          hide();
          onBlur?.(event);
        }}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={disabled}
        className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onMouseDown={(event) => {
          // Keep focus in the input so toggle works without a blur flicker.
          event.preventDefault();
        }}
        onClick={toggleVisibility}
        aria-label={visible ? "Passwort verbergen" : "Passwort anzeigen"}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
}

export { PasswordInput };
