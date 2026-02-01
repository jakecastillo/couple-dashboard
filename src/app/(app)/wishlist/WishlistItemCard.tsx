"use client";

import { useActionState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { ActionState } from "@/app/(app)/actions/types";
import {
  updateWishlistItemAction,
  deleteWishlistItemAction
} from "@/app/(app)/actions/wishlist";
import { FormMessage } from "@/components/forms/FormMessage";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { formatDate } from "@/lib/dates";

const initialState: ActionState = { ok: true };

export function WishlistItemCard({
  item
}: {
  item: {
    id: string;
    title: string;
    category: string;
    status: string;
    notes: string | null;
    target_date: string | null;
  };
}) {
  const [saveState, saveAction] = useActionState(updateWishlistItemAction, initialState);
  const [deleteState, deleteAction] = useActionState(
    deleteWishlistItemAction,
    initialState
  );
  const saveFields = !saveState.ok ? saveState.fields : undefined;

  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur transition dark:border-white/10 dark:bg-zinc-950/50 md:hover:-translate-y-[1px] md:hover:bg-white/80 md:hover:shadow-soft dark:md:hover:bg-zinc-950/60">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">{item.title}</p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {item.category.replaceAll("_", " ")}
            {item.target_date ? ` · Target: ${formatDate(item.target_date)}` : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-xl bg-blush-500/10 px-2 py-1 text-xs font-medium text-blush-700 dark:text-blush-200">
          {item.status}
        </span>
      </div>

      {item.notes ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-200">
          {item.notes}
        </p>
      ) : null}

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-50">
          <span className="inline-flex items-center gap-2">
            <Pencil className="size-4" />
            Edit
          </span>
        </summary>
        <div className="mt-3 space-y-3">
          <form action={saveAction} className="space-y-3">
            <input type="hidden" name="id" value={item.id} />
            <Label>
              Title
              <Input
                name="title"
                defaultValue={saveFields?.["title"] ?? item.title}
                required
              />
            </Label>
            <div className="grid gap-3 md:grid-cols-2">
              <Label>
                Category
                <select
                  name="category"
                  defaultValue={saveFields?.["category"] ?? item.category}
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
                  defaultValue={saveFields?.["status"] ?? item.status}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40 dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20"
                >
                  <option value="idea">Idea</option>
                  <option value="planned">Planned</option>
                  <option value="done">Done</option>
                </select>
              </Label>
            </div>
            <Label>
              Target date
              <Input
                name="target_date"
                type="date"
                defaultValue={saveFields?.["target_date"] ?? item.target_date ?? ""}
              />
            </Label>
            <Label>
              Notes
              <Textarea
                name="notes"
                defaultValue={saveFields?.["notes"] ?? item.notes ?? ""}
                rows={4}
              />
            </Label>

            {!saveState.ok ? (
              <FormMessage kind="error" message={saveState.message} />
            ) : null}
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
              if (!confirm("Delete this wishlist item?")) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            {!deleteState.ok ? (
              <FormMessage kind="error" message={deleteState.message} />
            ) : null}
            <Button type="submit" variant="danger">
              <Trash2 className="size-4" />
              Delete
            </Button>
          </form>
        </div>
      </details>
    </div>
  );
}
