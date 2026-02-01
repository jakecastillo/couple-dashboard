import Link from "next/link";
import { Plus, ListChecks } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WishlistItemCard } from "@/app/(app)/wishlist/WishlistItemCard";

export const dynamic = "force-dynamic";

const statusOrder: Record<string, number> = { planned: 0, idea: 1, done: 2 };
const statusLabel: Record<string, string> = {
  planned: "Planned",
  idea: "Ideas",
  done: "Done"
};

function compareTargetDate(a: string | null, b: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b);
}

export default async function WishlistPage() {
  const supabase = await createSupabaseServerClient();
  const { data: items, error } = await supabase
    .from("wishlist_items")
    .select("id,title,category,status,notes,target_date,updated_at")
    .limit(300);

  const sorted = (items ?? []).slice().sort((a, b) => {
    const sa = statusOrder[a.status] ?? 99;
    const sb = statusOrder[b.status] ?? 99;
    if (sa !== sb) return sa - sb;
    const dateCmp = compareTargetDate(a.target_date, b.target_date);
    if (dateCmp !== 0) return dateCmp;
    return (b.updated_at ?? "").localeCompare(a.updated_at ?? "");
  });

  const byStatus = new Map<string, typeof sorted>();
  for (const it of sorted) {
    const list = byStatus.get(it.status) ?? [];
    list.push(it);
    byStatus.set(it.status, list);
  }

  return (
    <main className="animate-fadeUp">
      <PageHeader
        title="Wishlist"
        subtitle="Ideas, plans, and little future joys."
        icon={ListChecks}
        right={
          <Link href="/wishlist/new">
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" />
              Add
            </Button>
          </Link>
        }
      />

      {error ? (
        <Card>
          <p className="text-sm text-rose-700 dark:text-rose-300">{error.message}</p>
        </Card>
      ) : sorted.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Start with a small idea — we’ll help you turn it into a plan.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {["planned", "idea", "done"].map((status) => {
            const list = byStatus.get(status) ?? [];
            if (list.length === 0) return null;
            return (
              <div key={status}>
                <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                  {statusLabel[status] ?? status}
                </p>
                <div className="space-y-2">
                  {list.map((item) => (
                    <WishlistItemCard
                      key={item.id}
                      item={{
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        status: item.status,
                        notes: item.notes,
                        target_date: item.target_date
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
