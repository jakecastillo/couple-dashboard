import Link from "next/link";
import { CalendarHeart, Clock, ListChecks, Plus, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconBadge } from "@/components/ui/IconBadge";
import { formatDate, daysSince } from "@/lib/dates";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("your_name,partner_name,anniversary_date,couple_id")
    .eq("id", user!.id)
    .single();

  const anniversary = profile?.anniversary_date ?? null;
  const daysTogether = anniversary ? daysSince(anniversary) + 1 : null;

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const yearNow = today.getFullYear();

  const [{ data: onThisDay }, { data: recentMemories }, { data: nextPlanned }] =
    await Promise.all([
      supabase
        .from("memories")
        .select("id,title,memory_date,location")
        .eq("memory_month", month)
        .eq("memory_day", day)
        .lt("memory_year", yearNow)
        .order("memory_date", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("memories")
        .select("id,title,memory_date,location")
        .order("memory_date", { ascending: false })
        .limit(3),
      supabase
        .from("wishlist_items")
        .select("id,title,category,status,target_date")
        .eq("status", "planned")
        .order("target_date", { ascending: true, nullsFirst: false })
        .limit(1)
        .maybeSingle()
    ]);

  const yourName = profile?.your_name ?? "You";
  const partnerName = profile?.partner_name ?? "your love";

  return (
    <main className="animate-fadeUp">
      <PageHeader
        title="Home"
        subtitle={`Hi ${yourName}. Here’s what’s glowing lately with ${partnerName}.`}
        icon={Sparkles}
        right={
          <Link href="/valentine" className="hidden md:block">
            <Button size="sm" variant="secondary">
              A little surprise
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Days together</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {daysTogether ?? "—"}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {anniversary
                  ? `Since ${formatDate(anniversary)}.`
                  : "Set your anniversary in Settings."}
              </p>
            </div>
            <IconBadge icon={CalendarHeart} />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">On this day</p>
            <IconBadge icon={Clock} />
          </div>
          {onThisDay ? (
            <div className="mt-2">
              <Link
                href={`/memories/${onThisDay.id}`}
                className="block rounded-xl p-2 transition hover:bg-zinc-100 dark:hover:bg-white/10"
              >
                <p className="text-sm font-medium">{onThisDay.title}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {formatDate(onThisDay.memory_date)}
                  {onThisDay.location ? ` · ${onThisDay.location}` : ""}
                </p>
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Add a few memories and we’ll bring one back on matching dates.
            </p>
          )}
        </Card>

        <Card className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium">Quick add</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Capture it while it’s fresh.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/memories/new">
                <Button size="sm">
                  <Plus className="size-4" aria-hidden="true" />
                  Memory
                </Button>
              </Link>
              <Link href="/wishlist/new">
                <Button size="sm" variant="secondary">
                  <Plus className="size-4" aria-hidden="true" />
                  Wishlist
                </Button>
              </Link>
              <Link href="/notes/new">
                <Button size="sm" variant="secondary">
                  <Plus className="size-4" aria-hidden="true" />
                  Note
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconBadge icon={Sparkles} className="size-8 rounded-xl" />
              <p className="text-sm font-medium">Recent memories</p>
            </div>
            <Link
              href="/memories"
              className="text-xs text-blush-700 hover:underline dark:text-blush-300"
            >
              View all
            </Link>
          </div>
          <div className="mt-2 space-y-1">
            {(recentMemories ?? []).length > 0 ? (
              (recentMemories ?? []).map((m) => (
                <Link
                  key={m.id}
                  href={`/memories/${m.id}`}
                  className="block rounded-xl px-2 py-2 transition hover:bg-zinc-100 dark:hover:bg-white/10"
                >
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {formatDate(m.memory_date)}
                    {m.location ? ` · ${m.location}` : ""}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Nothing yet — start with a favorite moment.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconBadge icon={ListChecks} className="size-8 rounded-xl" />
              <p className="text-sm font-medium">Next planned</p>
            </div>
            <Link
              href="/wishlist"
              className="text-xs text-blush-700 hover:underline dark:text-blush-300"
            >
              Wishlist
            </Link>
          </div>
          {nextPlanned ? (
            <div className="mt-2 rounded-xl bg-blush-500/10 p-3">
              <p className="text-sm font-semibold">{nextPlanned.title}</p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {nextPlanned.target_date
                  ? `Target: ${formatDate(nextPlanned.target_date)} · `
                  : ""}
                Category: {nextPlanned.category.replaceAll("_", " ")}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Mark an idea as planned and we’ll spotlight it here.
            </p>
          )}
        </Card>
      </div>

      <div className="mt-3 md:hidden">
        <Link href="/valentine">
          <Button variant="secondary" className="w-full">
            A little surprise
          </Button>
        </Link>
      </div>
    </main>
  );
}
