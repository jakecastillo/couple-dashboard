"use client";

import { useActionState } from "react";

import type { ActionState } from "@/app/(app)/actions/types";
import { updateProfileAction } from "@/app/(app)/actions/settings";
import { FormMessage } from "@/components/forms/FormMessage";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Label, Input } from "@/components/ui/Field";

const initialState: ActionState = { ok: true };

export function SettingsForm({
  initial
}: {
  initial: { your_name: string; partner_name: string; anniversary_date: string };
}) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);
  const fields = !state.ok ? state.fields : undefined;

  return (
    <form action={formAction} className="space-y-3">
      <Label>
        Your name
        <Input
          name="your_name"
          defaultValue={fields?.["your_name"] ?? initial.your_name}
          placeholder="e.g. Jake"
        />
      </Label>
      <Label>
        Partner name
        <Input
          name="partner_name"
          defaultValue={fields?.["partner_name"] ?? initial.partner_name}
          placeholder="e.g. Alex"
        />
      </Label>
      <Label>
        Anniversary date
        <Input
          name="anniversary_date"
          type="date"
          defaultValue={fields?.["anniversary_date"] ?? initial.anniversary_date}
        />
      </Label>

      {!state.ok ? <FormMessage kind="error" message={state.message} /> : null}
      {state.ok && state.message ? (
        <FormMessage kind="success" message={state.message} />
      ) : null}

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingText="Saving…">
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
