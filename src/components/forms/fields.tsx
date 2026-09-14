"use client";

import type { AnyFieldApi } from "@tanstack/react-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";

type TextFieldProps = {
  field: AnyFieldApi;
  label: string;
  description?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
};

function fieldErrors(field: AnyFieldApi) {
  return field.state.meta.errors.map((error) =>
    typeof error === "string" ? { message: error } : error,
  );
}

export function TextField({
  field,
  label,
  description,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
}: TextFieldProps) {
  const isInvalid = field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={(field.state.value as string) ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={fieldErrors(field)} /> : null}
    </Field>
  );
}

type PasswordFieldProps = {
  field: AnyFieldApi;
  label: string;
  description?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  /** Auto-hide after revealing. `0` or `false` disables the timer. Default: 8s. */
  hideAfterMs?: number | false;
};

export function PasswordField({
  field,
  label,
  description,
  placeholder,
  autoComplete,
  disabled,
  hideAfterMs,
}: PasswordFieldProps) {
  const isInvalid = field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <PasswordInput
        id={field.name}
        name={field.name}
        value={(field.state.value as string) ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        hideAfterMs={hideAfterMs}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={fieldErrors(field)} /> : null}
    </Field>
  );
}

type CheckboxFieldProps = {
  field: AnyFieldApi;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function CheckboxField({
  field,
  label,
  description,
  disabled,
}: CheckboxFieldProps) {
  const isInvalid = field.state.meta.errors.length > 0;
  const checked = Boolean(field.state.value);

  return (
    <Field orientation="horizontal" data-invalid={isInvalid || undefined}>
      <Checkbox
        id={field.name}
        checked={checked}
        onCheckedChange={(value) => {
          field.handleChange(value);
          field.handleBlur();
        }}
        disabled={disabled}
        aria-invalid={isInvalid}
      />
      <div className="flex flex-col gap-0.5">
        <FieldLabel htmlFor={field.name} className="font-normal">
          {label}
        </FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {isInvalid ? <FieldError errors={fieldErrors(field)} /> : null}
      </div>
    </Field>
  );
}
