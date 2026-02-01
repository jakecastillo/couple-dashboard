import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { IconBadge } from "@/components/ui/IconBadge";

export default function BlockedPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10">
      <div className="w-full animate-fadeUp rounded-2xl border border-white/50 bg-white/70 p-5 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/50">
        <div className="mb-4">
          <IconBadge
            icon={ShieldAlert}
            className="size-11 rounded-2xl"
            iconClassName="size-5"
          />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Not on the guest list</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          This dashboard is private. If you believe this is a mistake, double-check you’re
          using the allowed email address.
        </p>
        <Link
          href="/auth"
          className="mt-4 inline-flex rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-zinc-900 active:scale-[0.99] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
