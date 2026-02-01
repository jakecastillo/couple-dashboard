import Link from "next/link";
import { StickyNote, X } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { NoteForm } from "@/app/(app)/notes/new/NoteForm";

export default function NewNotePage() {
  return (
    <main className="animate-fadeUp">
      <PageHeader
        title="New note"
        subtitle="Markdown-friendly, keeps the little things safe."
        icon={StickyNote}
        right={
          <Link href="/notes">
            <Button size="sm" variant="secondary">
              <X className="size-4" aria-hidden="true" />
              Cancel
            </Button>
          </Link>
        }
      />
      <NoteForm />
    </main>
  );
}
