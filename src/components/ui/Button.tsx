"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium shadow-sm transition",
        "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "px-3 py-2" : "px-4 py-2.5",
        variant === "primary" &&
          "bg-zinc-950 text-white shadow-soft hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100",
        variant === "secondary" &&
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900",
        variant === "ghost" &&
          "bg-transparent text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10",
        variant === "danger" &&
          "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600",
        className
      )}
      {...props}
    />
  );
}
