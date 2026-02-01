"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createWishlistItemAction } from "@/app/(app)/actions/wishlist";
import type { ActionState } from "@/app/(app)/actions/types";
import { FormMessage } from "@/components/forms/FormMessage";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Card } from "@/components/ui/Card";
import { Label, Input, Textarea } from "@/components/ui/Field";

const initialState: ActionState = { ok: true };

export function WishlistForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createWishlistItemAction, initialState);
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
            placeholder="Something we’d love to do"
            defaultValue={fields?.["title"] ?? ""}
          />
        </Label>
        <div className="grid gap-3 md:grid-cols-2">
          <Label>
            Category
            <select
              name="category"
              defaultValue={fields?.["category"] ?? "date_night"}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40 dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20"
            >
              <option value="date_night">Date night</option>
              <option value="trip">Trip</option>
              <option value="gift">Gift</option>
              <option value="food">Food</option>
              <option value="someday">Someday</option>
            </select>
          </Label>
          <Label>
            Status
            <select
              name="status"
              defaultValue={fields?.["status"] ?? "idea"}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40 dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20"
            >
              <option value="idea">Idea</option>
              <option value="planned">Planned</option>
              <option value="done">Done</option>
            </select>
          </Label>
        </div>
        <Label>
          Target date (optional)
          <Input
            name="target_date"
            type="date"
            defaultValue={fields?.["target_date"] ?? ""}
          />
        </Label>
        <Label>
          Notes (optional)
          <Textarea
            name="notes"
            rows={5}
            placeholder="Budget, links, thoughts…"
            defaultValue={fields?.["notes"] ?? ""}
          />
        </Label>

        {!state.ok ? <FormMessage kind="error" message={state.message} /> : null}

        <div className="flex justify-end">
          <SubmitButton pendingText="Saving…">Save item</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
