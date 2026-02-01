"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { updateMemoryAction, deleteMemoryAction } from "@/app/(app)/actions/memories";
import type { ActionState } from "@/app/(app)/actions/types";
import { FormMessage } from "@/components/forms/FormMessage";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea } from "@/components/ui/Field";

const initialState: ActionState = { ok: true };

export function MemoryEditForm({
  id,
  title,
  memory_date,
  location,
  story
}: {
  id: string;
  title: string;
  memory_date: string;
  location: string | null;
  story: string | null;
}) {
  const router = useRouter();
  const [saveState, saveAction] = useActionState(updateMemoryAction, initialState);
  const [deleteState, deleteFormAction] = useActionState(
    deleteMemoryAction,
    initialState
  );
  const saveFields = !saveState.ok ? saveState.fields : undefined;

  useEffect(() => {
    if (deleteState.ok && deleteState.redirectTo) router.push(deleteState.redirectTo);
  }, [deleteState, router]);

  return (
    <div className="space-y-3">
      <form action={saveAction} className="space-y-3">
        <input type="hidden" name="id" value={id} />
        <Label>
          Title
          <Input name="title" defaultValue={saveFields?.["title"] ?? title} required />
        </Label>
        <Label>
          Date
          <Input
            name="memory_date"
            type="date"
            defaultValue={saveFields?.["memory_date"] ?? memory_date}
            required
          />
        </Label>
        <Label>
          Location
          <Input
            name="location"
            defaultValue={saveFields?.["location"] ?? location ?? ""}
          />
        </Label>
        <Label>
          Story
          <Textarea
            name="story"
            defaultValue={saveFields?.["story"] ?? story ?? ""}
            rows={8}
          />
        </Label>

        {!saveState.ok ? <FormMessage kind="error" message={saveState.message} /> : null}
        {saveState.ok && saveState.message ? (
          <FormMessage kind="success" message={saveState.message} />
        ) : null}

        <div className="flex justify-end">
          <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
        </div>
      </form>

      <form
        action={deleteFormAction}
        onSubmit={(e) => {
          if (!confirm("Delete this memory? This can’t be undone.")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        {!deleteState.ok ? (
          <FormMessage kind="error" message={deleteState.message} />
        ) : null}
        <Button type="submit" variant="danger">
          Delete memory
        </Button>
      </form>
    </div>
  );
}
