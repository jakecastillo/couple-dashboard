import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, StickyNote } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Markdown } from "@/components/markdown/Markdown";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NoteEditForm } from "@/app/(app)/notes/[id]/NoteEditForm";

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: note } = await supabase
    .from("notes")
    .select("id,title,body,pinned")
    .eq("id", id)
    .single();

  if (!note) notFound();

  return (
    <main className="animate-fadeUp">
      <PageHeader
        title={note.title}
        subtitle={note.pinned ? "Pinned" : "—"}
        icon={StickyNote}
        right={
          <Link href="/notes">
            <Button size="sm" variant="secondary">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="md:col-span-2">
          <Markdown content={note.body} />
        </Card>
        <Card className="md:col-span-2">
          <details>
            <summary className="cursor-pointer text-sm font-medium">Edit note</summary>
            <div className="mt-4">
              <NoteEditForm note={note} />
            </div>
          </details>
        </Card>
      </div>
    </main>
  );
}
