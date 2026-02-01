import Link from "next/link";
import { Plus, Search, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MemoryListItem } from "@/app/(app)/memories/MemoryListItem";

export const dynamic = "force-dynamic";

export default async function MemoriesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params["q"] === "string" ? params["q"].trim() : "";
  const yearParam = typeof params["year"] === "string" ? params["year"] : "";
  const year = yearParam && /^\d{4}$/.test(yearParam) ? Number(yearParam) : null;

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("memories")
    .select("id,title,memory_date,location,memory_year")
    .order("memory_date", { ascending: false })
    .limit(200);

  if (q) {
    const escaped = q.replaceAll(",", "");
    query = query.or(
      `title.ilike.%${escaped}%,location.ilike.%${escaped}%,story.ilike.%${escaped}%`
    );
  }
  if (year) query = query.eq("memory_year", year);

  const { data: memories, error } = await query;

  const years = Array.from(new Set((memories ?? []).map((m) => m.memory_year))).sort(
    (a, b) => b - a
  );

  const grouped = new Map<number, NonNullable<typeof memories>>();
  for (const m of memories ?? []) {
    const list = grouped.get(m.memory_year) ?? [];
    list.push(m);
    grouped.set(m.memory_year, list);
  }

  return (
    <main className="animate-fadeUp">
      <PageHeader
        title="Memories"
        subtitle="A timeline you’ll love revisiting."
        icon={Sparkles}
        right={
          <Link href="/memories/new">
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" />
              Add
            </Button>
          </Link>
        }
      />

      <Card className="mb-3">
        <form
          className="grid gap-2 md:grid-cols-[1fr_200px_auto] md:items-end"
          action="/memories"
        >
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Search
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Title, location, story…"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40 dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Year
            <select
              name="year"
              defaultValue={year ?? ""}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-200/40 dark:border-white/10 dark:bg-zinc-950 dark:focus:border-blush-500 dark:focus:ring-blush-500/20"
            >
              <option value="">All</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Filter
            </Button>
            <Link href="/memories">
              <Button type="button" size="sm" variant="secondary">
                Clear
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      {error ? (
        <Card>
          <p className="text-sm text-rose-700 dark:text-rose-300">{error.message}</p>
        </Card>
      ) : (memories ?? []).length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No memories match yet. Add one you want to keep forever.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries())
            .sort(([a], [b]) => b - a)
            .map(([y, items]) => (
              <div key={y}>
                <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                  {y}
                </p>
                <div className="space-y-2">
                  {items.map((m) => (
                    <MemoryListItem
                      key={m.id}
                      memory={{
                        id: m.id,
                        title: m.title,
                        memory_date: m.memory_date,
                        location: m.location
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
