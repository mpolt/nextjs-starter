import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "@/lib/redirect";

describe("safeRedirectPath", () => {
  it("returns the fallback for empty values", () => {
    expect(safeRedirectPath(null)).toBe("/dashboard");
    expect(safeRedirectPath(undefined)).toBe("/dashboard");
    expect(safeRedirectPath("")).toBe("/dashboard");
    expect(safeRedirectPath(null, "/settings")).toBe("/settings");
  });

  it("allows relative same-origin paths", () => {
    expect(safeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(safeRedirectPath("/dashboard/settings?tab=security")).toBe(
      "/dashboard/settings?tab=security",
    );
    expect(safeRedirectPath("/verify-email")).toBe("/verify-email");
  });

  it("rejects absolute URLs and protocol-relative paths", () => {
    expect(safeRedirectPath("https://evil.example/phish")).toBe("/dashboard");
    expect(safeRedirectPath("http://evil.example")).toBe("/dashboard");
    expect(safeRedirectPath("//evil.example/phish")).toBe("/dashboard");
  });

  it("rejects paths that do not start with /", () => {
    expect(safeRedirectPath("dashboard")).toBe("/dashboard");
    expect(safeRedirectPath("login")).toBe("/dashboard");
  });

  it("rejects paths containing a scheme mid-string", () => {
    expect(safeRedirectPath("/redirect?next=https://evil.example")).toBe(
      "/dashboard",
    );
  });
});
