import { describe, expect, it } from "vitest";

import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "max@example.com",
      password: "secret",
      rememberMe: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
      rememberMe: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "max@example.com",
      password: "",
      rememberMe: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts matching passwords", () => {
    const result = registerSchema.safeParse({
      name: "Max Mustermann",
      email: "max@example.com",
      password: "password1",
      confirmPassword: "password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Max Mustermann",
      email: "max@example.com",
      password: "password1",
      confirmPassword: "password2",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("confirmPassword"))).toBe(
        true,
      );
    }
  });

  it("rejects a password that is too short", () => {
    const result = registerSchema.safeParse({
      name: "Max",
      email: "max@example.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires matching passwords", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "password1",
        confirmPassword: "password1",
      }).success,
    ).toBe(true);

    expect(
      resetPasswordSchema.safeParse({
        password: "password1",
        confirmPassword: "other",
      }).success,
    ).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("requires the current password and matching new passwords", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "old-password",
        newPassword: "new-password",
        confirmPassword: "new-password",
      }).success,
    ).toBe(true);

    expect(
      changePasswordSchema.safeParse({
        currentPassword: "",
        newPassword: "new-password",
        confirmPassword: "new-password",
      }).success,
    ).toBe(false);

    expect(
      changePasswordSchema.safeParse({
        currentPassword: "old-password",
        newPassword: "new-password",
        confirmPassword: "mismatch",
      }).success,
    ).toBe(false);
  });
});
