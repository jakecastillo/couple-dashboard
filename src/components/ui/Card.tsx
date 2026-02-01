import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/50",
        className
      )}
      {...props}
    />
  );
}
