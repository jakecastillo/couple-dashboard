import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function IconBadge({
  icon: Icon,
  className,
  iconClassName
}: {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-2xl border border-white/50 bg-blush-500/10 text-blush-700 shadow-sm dark:border-white/10 dark:text-blush-200",
        className
      )}
      aria-hidden="true"
    >
      <Icon className={cn("size-4", iconClassName)} />
    </div>
  );
}
