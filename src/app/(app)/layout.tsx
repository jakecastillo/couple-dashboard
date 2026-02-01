import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { ensureBootstrapped } from "@/lib/server/bootstrap";
import { AppMeta, getConfiguredAllowedEmails } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const allowed = getConfiguredAllowedEmails();
  if (allowed.length === 2) {
    const email = user.email?.toLowerCase() ?? "";
    if (!allowed.includes(email)) {
      await supabase.auth.signOut();
      redirect("/auth/blocked");
    }
  }

  try {
    await ensureBootstrapped();
  } catch (err) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-xl items-center px-4 py-10">
        <Card className="w-full">
          <h1 className="text-xl font-semibold tracking-tight">Configuration required</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Set <span className="font-mono text-xs">COUPLE_ALLOWED_EMAILS</span> to
            exactly two comma-separated emails, then restart the app.
          </p>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            {err instanceof Error ? err.message : "Missing allowlist configuration."}
          </p>
        </Card>
      </div>
    );
  }

  return <AppShell appName={AppMeta.name}>{children}</AppShell>;
}
