import Link from "next/link";
import { Plus, StickyNote } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NoteListItem } from "@/app/(app)/notes/NoteListItem";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id,title,body,pinned,updated_at")
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(200);

  return (
    <main className="animate-fadeUp">
      <PageHeader
        title="Notes"
        subtitle="Little things worth keeping."
        icon={StickyNote}
        right={
          <Link href="/notes/new">
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
      ) : (notes ?? []).length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Start with a note you’d want to find again later.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {(notes ?? []).map((n) => (
            <NoteListItem key={n.id} note={n} />
          ))}
        </div>
      )}
    </main>
  );
}
