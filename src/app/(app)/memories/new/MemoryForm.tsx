"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createMemoryAction } from "@/app/(app)/actions/memories";
import type { ActionState } from "@/app/(app)/actions/types";
import { FormMessage } from "@/components/forms/FormMessage";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";

const initialState: ActionState = { ok: true };

export function MemoryForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createMemoryAction, initialState);
  const fields = !state.ok ? state.fields : undefined;

  useEffect(() => {
    if (state.ok && state.redirectTo) router.push(state.redirectTo);
  }, [state, router]);

  return (
    <Card>
      <form action={formAction} className="space-y-3">
        <Label>
          Title
          <Input
            name="title"
            placeholder="A tiny moment that mattered"
            required
            defaultValue={fields?.["title"] ?? ""}
          />
        </Label>
        <Label>
          Date
          <Input
            name="memory_date"
            type="date"
            required
            defaultValue={fields?.["memory_date"] ?? ""}
          />
        </Label>
        <Label>
          Location (optional)
          <Input
            name="location"
            placeholder="Where were you?"
            defaultValue={fields?.["location"] ?? ""}
          />
        </Label>
        <Label>
          Story (optional)
          <Textarea
            name="story"
            rows={6}
            placeholder="A few lines, a whole feeling."
            defaultValue={fields?.["story"] ?? ""}
          />
        </Label>

        {!state.ok ? <FormMessage kind="error" message={state.message} /> : null}

        <div className="flex items-center justify-end">
          <SubmitButton pendingText="Saving…">Save memory</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
