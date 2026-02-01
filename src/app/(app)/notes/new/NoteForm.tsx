"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/(app)/actions/types";
import { createNoteAction } from "@/app/(app)/actions/notes";
import { Card } from "@/components/ui/Card";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/forms/FormMessage";
import { SubmitButton } from "@/components/forms/SubmitButton";

const initialState: ActionState = { ok: true };

export function NoteForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createNoteAction, initialState);
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
            required
            placeholder="A tiny love letter, a plan, a thought…"
            defaultValue={fields?.["title"] ?? ""}
          />
        </Label>
        <Label>
          Note (Markdown)
          <Textarea
            name="body"
            rows={12}
            required
            placeholder="Write in Markdown if you want…"
            defaultValue={fields?.["body"] ?? ""}
          />
        </Label>

        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
          <input
            type="checkbox"
            name="pinned"
            defaultChecked={fields?.["pinned"] === "on"}
            className="size-4 rounded border-zinc-300 text-blush-600 focus:ring-blush-300 dark:border-white/20 dark:bg-zinc-950"
          />
          Pin to top
        </label>

        {!state.ok ? <FormMessage kind="error" message={state.message} /> : null}

        <div className="flex justify-end">
          <SubmitButton pendingText="Saving…">Save note</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
