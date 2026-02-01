"use client";

import { cn } from "@/lib/utils";

export function FormMessage({
  kind,
  message
}: {
  kind: "error" | "success";
  message: string;
}) {
  return (
    <p
      className={cn(
        "rounded-xl border px-3 py-2 text-sm",
        kind === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200"
          : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
      )}
    >
      {message}
    </p>
  );
}
