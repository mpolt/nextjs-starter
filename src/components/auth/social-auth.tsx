"use client";

import { Separator } from "@/components/ui/separator";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

type SocialAuthProps = {
  enabled: boolean;
  callbackURL: string;
};

export function SocialAuth({ enabled, callbackURL }: SocialAuthProps) {
  if (!enabled) {
    return null;
  }

  return (
    <div className="space-y-6">
      <GoogleSignInButton callbackURL={callbackURL} />
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">oder</span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}
