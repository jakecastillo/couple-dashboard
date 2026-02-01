import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-zinc-800 dark:text-zinc-200",
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition",
        "focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40",
        "dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition",
        "focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40",
        "dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20",
        className
      )}
      {...props}
    />
  );
}
