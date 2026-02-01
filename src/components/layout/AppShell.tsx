"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  ListChecks,
  Notebook,
  Sparkles,
  StickyNote,
  type LucideIcon
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const primaryNav: NavItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/memories", label: "Memories", icon: Sparkles },
  { href: "/wishlist", label: "Wishlist", icon: ListChecks },
  { href: "/notes", label: "Notes", icon: StickyNote }
];

export function AppShell({
  children,
  appName
}: {
  children: React.ReactNode;
  appName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="pt-safe mx-auto min-h-dvh w-full max-w-6xl px-3 md:grid md:grid-cols-[260px_1fr] md:gap-6 md:px-6 md:py-6">
      <aside className="hidden md:block">
        <div className="sticky top-6 space-y-3">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/50">
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-blush-500/10 text-blush-600 dark:text-blush-300">
                <Heart className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">{appName}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Private & cozy</p>
              </div>
            </div>
          </div>

          <nav className="rounded-2xl border border-white/60 bg-white/70 p-2 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/50">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/home" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-blush-500/10 text-zinc-950 dark:text-zinc-50"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      active ? "text-blush-600 dark:text-blush-300" : ""
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <div className="my-2 h-px bg-zinc-200/80 dark:bg-white/10" />
            <Link
              href="/settings"
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                pathname.startsWith("/settings")
                  ? "bg-blush-500/10 text-zinc-950 dark:text-zinc-50"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
              )}
            >
              <Notebook className="size-4 text-zinc-500 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      </aside>

      <div className="pb-safe min-w-0 md:pb-0">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-6xl px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-white/60 bg-white/80 p-2 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/home" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition",
                  active
                    ? "bg-blush-500/10 text-zinc-950 dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    active ? "text-blush-600 dark:text-blush-300" : ""
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
