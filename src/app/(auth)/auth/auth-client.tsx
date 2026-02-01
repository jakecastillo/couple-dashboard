"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import { IconBadge } from "@/components/ui/IconBadge";

export default function AuthClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const next = searchParams.get("next") ?? "/home";

      if (mode === "signup") {
        const res = await fetch("/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || "Could not create account.");
        }
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace(next);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Sign-in failed.");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10">
      <div className="w-full animate-fadeUp rounded-2xl border border-white/50 bg-white/70 p-5 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/50">
        <div className="mb-4">
          <IconBadge
            icon={Heart}
            className="size-11 rounded-2xl"
            iconClassName="size-5"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
            Private
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            A calm little space for the two of you.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Email
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition",
                "focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40",
                "dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20"
              )}
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Password
            <input
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition",
                "focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40",
                "dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20"
              )}
              placeholder={
                mode === "signin" ? "Your password" : "Create a password (8+ chars)"
              }
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending" || email.length < 3 || password.length < 8}
            className={cn(
              "w-full rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition active:scale-[0.99]",
              "hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60",
              "dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            )}
          >
            {status === "sending"
              ? mode === "signin"
                ? "Signing in…"
                : "Creating account…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>

          {message ? (
            <p
              className={cn(
                "rounded-xl border px-3 py-2 text-sm",
                "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
              )}
            >
              {message}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setStatus("idle");
              setMode((m) => (m === "signin" ? "signup" : "signin"));
            }}
            className={cn(
              "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition active:scale-[0.99]",
              "hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            )}
          >
            {mode === "signin" ? "Create an account" : "Back to sign in"}
          </button>
        </form>

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Tip: add this app to your home screen for the best experience.
        </p>
      </div>
    </main>
  );
}
