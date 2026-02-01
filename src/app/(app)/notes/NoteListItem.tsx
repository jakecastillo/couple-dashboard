"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { useTransition } from "react";

import { deleteNoteByIdAction, togglePinNoteAction } from "@/app/(app)/actions/notes";
import { cn } from "@/lib/utils";

export function NoteListItem({
  note
}: {
  note: { id: string; title: string; body: string; pinned: boolean };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur transition dark:border-white/10 dark:bg-zinc-950/50 md:hover:-translate-y-[1px] md:hover:bg-white/80 md:hover:shadow-soft dark:md:hover:bg-zinc-950/60">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/notes/${note.id}`} className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">{note.title}</p>
          <p className="mt-1 max-h-12 overflow-hidden whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-200">
            {note.body}
          </p>
        </Link>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await togglePinNoteAction({
                  id: note.id,
                  pinned: !note.pinned
                });
                if (res.ok) router.refresh();
              })
            }
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:scale-[0.99] disabled:opacity-60",
              "dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            )}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
            title={note.pinned ? "Unpin" : "Pin"}
          >
            {note.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("Delete this note?")) return;
              startTransition(async () => {
                const res = await deleteNoteByIdAction({ id: note.id });
                if (res.ok) router.refresh();
              });
            }}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-700 shadow-sm transition hover:bg-rose-50 active:scale-[0.99] disabled:opacity-60",
              "dark:border-rose-900/40 dark:bg-zinc-950 dark:text-rose-200 dark:hover:bg-rose-950/30"
            )}
            aria-label="Delete note"
            title="Delete"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
