import { revalidateLogic } from "@tanstack/react-form";

/**
 * Validate on submit first; after the first attempt, revalidate on change.
 * Use with `validators: { onDynamic: schema }`.
 */
export const submitThenChangeLogic = revalidateLogic({
  mode: "submit",
  modeAfterSubmission: "change",
});

export function withDynamicSchema<TSchema>(schema: TSchema) {
  return {
    validators: {
      onDynamic: schema,
    },
    validationLogic: submitThenChangeLogic,
  } as const;
}
