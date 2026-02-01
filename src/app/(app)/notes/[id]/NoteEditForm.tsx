"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/(app)/actions/types";
import { updateNoteAction, deleteNoteAction } from "@/app/(app)/actions/notes";
import { FormMessage } from "@/components/forms/FormMessage";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea } from "@/components/ui/Field";

const initialState: ActionState = { ok: true };

export function NoteEditForm({
  note
}: {
  note: { id: string; title: string; body: string; pinned: boolean };
}) {
  const router = useRouter();
  const [saveState, saveAction] = useActionState(updateNoteAction, initialState);
  const [deleteState, deleteAction] = useActionState(deleteNoteAction, initialState);
  const saveFields = !saveState.ok ? saveState.fields : undefined;

  useEffect(() => {
    if (deleteState.ok && deleteState.redirectTo) router.push(deleteState.redirectTo);
  }, [deleteState, router]);

  return (
    <div className="space-y-3">
      <form action={saveAction} className="space-y-3">
        <input type="hidden" name="id" value={note.id} />
        <Label>
          Title
          <Input
            name="title"
            defaultValue={saveFields?.["title"] ?? note.title}
            required
          />
        </Label>
        <Label>
          Body (Markdown)
          <Textarea
            name="body"
            defaultValue={saveFields?.["body"] ?? note.body}
            rows={12}
            required
          />
        </Label>

        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
          <input
            type="checkbox"
            name="pinned"
            defaultChecked={saveFields ? saveFields["pinned"] === "on" : note.pinned}
            className="size-4 rounded border-zinc-300 text-blush-600 focus:ring-blush-300 dark:border-white/20 dark:bg-zinc-950"
          />
          Pin to top
        </label>

        {!saveState.ok ? <FormMessage kind="error" message={saveState.message} /> : null}
        {saveState.ok && saveState.message ? (
          <FormMessage kind="success" message={saveState.message} />
        ) : null}

        <div className="flex justify-end">
          <SubmitButton pendingText="Saving…">Save</SubmitButton>
        </div>
      </form>

      <form
        action={deleteAction}
        onSubmit={(e) => {
          if (!confirm("Delete this note?")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={note.id} />
        {!deleteState.ok ? (
          <FormMessage kind="error" message={deleteState.message} />
        ) : null}
        <Button type="submit" variant="danger">
          Delete note
        </Button>
      </form>
    </div>
  );
}
