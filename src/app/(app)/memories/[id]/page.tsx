import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/dates";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MemoryEditForm } from "@/app/(app)/memories/[id]/MemoryEditForm";
import { MemoryPhotoUploader } from "@/app/(app)/memories/[id]/MemoryPhotoUploader";

export const dynamic = "force-dynamic";

export default async function MemoryDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: memory } = await supabase
    .from("memories")
    .select("id,title,memory_date,location,story,couple_id")
    .eq("id", id)
    .single();

  if (!memory) notFound();

  const { data: photos } = await supabase
    .from("memory_photos")
    .select("id,storage_path")
    .eq("memory_id", id)
    .order("created_at", { ascending: false });

  return (
    <main className="animate-fadeUp">
      <PageHeader
        title={memory.title}
        subtitle={`${formatDate(memory.memory_date)}${memory.location ? ` · ${memory.location}` : ""}`}
        icon={Sparkles}
        right={
          <Link href="/memories">
            <Button size="sm" variant="secondary">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="md:col-span-2">
          {memory.story ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-100">
              {memory.story}
            </p>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Add a story — a few lines go a long way.
            </p>
          )}
        </Card>

        <Card className="md:col-span-2">
          <MemoryPhotoUploader
            coupleId={memory.couple_id}
            memoryId={memory.id}
            initialPhotos={(photos ?? []).map((p) => ({
              id: p.id,
              storage_path: p.storage_path
            }))}
          />
        </Card>

        <Card className="md:col-span-2">
          <details>
            <summary className="cursor-pointer text-sm font-medium">Edit memory</summary>
            <div className="mt-4">
              <MemoryEditForm
                id={memory.id}
                title={memory.title}
                memory_date={memory.memory_date}
                location={memory.location}
                story={memory.story}
              />
            </div>
          </details>
        </Card>
      </div>
    </main>
  );
}
