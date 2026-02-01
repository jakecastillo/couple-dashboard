import Link from "next/link";
import { Settings, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { IconBadge } from "@/components/ui/IconBadge";

export function PageHeader({
  title,
  subtitle,
  right,
  icon
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {icon ? <IconBadge icon={icon} className="size-10 rounded-2xl" /> : null}
          <div className="min-w-0">
            <h1 className="text-balance text-xl font-semibold tracking-tight md:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {right}
        <Link
          href="/settings"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:scale-[0.99]",
            "dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          )}
          aria-label="Settings"
        >
          <Settings className="size-4" />
        </Link>
      </div>
    </div>
  );
}
