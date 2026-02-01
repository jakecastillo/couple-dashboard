import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getConfiguredAllowedEmails } from "@/lib/config";
import { SettingsForm } from "@/app/(app)/settings/SettingsForm";
import { signOutAction } from "@/app/(app)/actions/auth";
import { LogOut, NotebookPen, Shield, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("your_name,partner_name,anniversary_date")
    .eq("id", user!.id)
    .single();

  const allowed = getConfiguredAllowedEmails();

  return (
    <main className="animate-fadeUp">
      <PageHeader title="Settings" subtitle="Make it yours." icon={NotebookPen} />
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-sm font-medium">Profile</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Names + anniversary date.
          </p>
          <div className="mt-4">
            <SettingsForm
              initial={{
                your_name: profile?.your_name ?? "",
                partner_name: profile?.partner_name ?? "",
                anniversary_date: profile?.anniversary_date ?? ""
              }}
            />
          </div>
        </Card>

        <Card>
          <p className="text-sm font-medium">Theme</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Light or dark.</p>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Shield
              className="size-4 text-blush-700 dark:text-blush-200"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">Allowlist</p>
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Only these two emails can access the dashboard (set in{" "}
            <span className="font-mono text-xs">COUPLE_ALLOWED_EMAILS</span>).
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {allowed.length === 0 ? (
              <li className="text-rose-700 dark:text-rose-300">Not configured.</li>
            ) : (
              allowed.map((e) => (
                <li key={e} className="rounded-xl bg-blush-500/10 px-3 py-2">
                  {e}
                </li>
              ))
            )}
          </ul>
        </Card>

        <Card className="md:col-span-2">
          <div className="flex items-center gap-2">
            <UserRound
              className="size-4 text-blush-700 dark:text-blush-200"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">Account</p>
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
          <form action={signOutAction} className="mt-4">
            <button
              type="submit"
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 active:scale-[0.99] dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <span className="inline-flex items-center gap-2">
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </span>
            </button>
          </form>
        </Card>
      </div>
    </main>
  );
}
