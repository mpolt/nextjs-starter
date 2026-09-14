import { afterEach, describe, expect, it } from "vitest";

import {
  getGoogleAuthCredentials,
  hasAdminRole,
  isAdminEmail,
  isGoogleAuthEnabled,
} from "@/lib/auth-config";

const originalEnv = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};

afterEach(() => {
  process.env.GOOGLE_CLIENT_ID = originalEnv.GOOGLE_CLIENT_ID;
  process.env.GOOGLE_CLIENT_SECRET = originalEnv.GOOGLE_CLIENT_SECRET;
  process.env.ADMIN_EMAIL = originalEnv.ADMIN_EMAIL;
});

describe("getGoogleAuthCredentials", () => {
  it("returns credentials only when both values are set", () => {
    process.env.GOOGLE_CLIENT_ID = " google-id ";
    process.env.GOOGLE_CLIENT_SECRET = " google-secret ";

    expect(getGoogleAuthCredentials()).toEqual({
      clientId: "google-id",
      clientSecret: "google-secret",
    });
    expect(isGoogleAuthEnabled()).toBe(true);
  });

  it("is disabled when a key is missing or blank", () => {
    process.env.GOOGLE_CLIENT_ID = "google-id";
    process.env.GOOGLE_CLIENT_SECRET = "";

    expect(getGoogleAuthCredentials()).toBeNull();
    expect(isGoogleAuthEnabled()).toBe(false);

    delete process.env.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = "secret";

    expect(isGoogleAuthEnabled()).toBe(false);
  });
});

describe("isAdminEmail", () => {
  it("matches the configured admin email case-insensitively", () => {
    process.env.ADMIN_EMAIL = " Admin@example.com ";

    expect(isAdminEmail("admin@example.com")).toBe(true);
    expect(isAdminEmail("other@example.com")).toBe(false);
  });

  it("is false when ADMIN_EMAIL is unset", () => {
    delete process.env.ADMIN_EMAIL;

    expect(isAdminEmail("admin@example.com")).toBe(false);
  });
});

describe("hasAdminRole", () => {
  it("detects admin in a single or comma-separated role", () => {
    expect(hasAdminRole("admin")).toBe(true);
    expect(hasAdminRole("user,admin")).toBe(true);
    expect(hasAdminRole("user")).toBe(false);
    expect(hasAdminRole(undefined)).toBe(false);
    expect(hasAdminRole(null)).toBe(false);
  });
});
