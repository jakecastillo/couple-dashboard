"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

import { deleteMemoryByIdAction } from "@/app/(app)/actions/memories";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function MemoryListItem({
  memory
}: {
  memory: { id: string; title: string; memory_date: string; location: string | null };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-2 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur transition",
        "dark:border-white/10 dark:bg-zinc-950/50 md:hover:-translate-y-[1px] md:hover:bg-white/80 md:hover:shadow-soft dark:md:hover:bg-zinc-950/60"
      )}
    >
      <Link href={`/memories/${memory.id}`} className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight">{memory.title}</p>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          {formatDate(memory.memory_date)}
          {memory.location ? ` · ${memory.location}` : ""}
        </p>
      </Link>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this memory? This can’t be undone.")) return;
          startTransition(async () => {
            const res = await deleteMemoryByIdAction({ id: memory.id });
            if (res.ok) router.refresh();
          });
        }}
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-700 shadow-sm transition hover:bg-rose-50 active:scale-[0.99] disabled:opacity-60",
          "dark:border-rose-900/40 dark:bg-zinc-950 dark:text-rose-200 dark:hover:bg-rose-950/30"
        )}
        aria-label="Delete memory"
        title="Delete"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
