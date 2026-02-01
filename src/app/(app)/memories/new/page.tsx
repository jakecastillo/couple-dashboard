import Link from "next/link";
import { Sparkles, X } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { MemoryForm } from "@/app/(app)/memories/new/MemoryForm";

export default function NewMemoryPage() {
  return (
    <main className="animate-fadeUp">
      <PageHeader
        title="New memory"
        subtitle="Capture it while it’s warm."
        icon={Sparkles}
        right={
          <Link href="/memories">
            <Button size="sm" variant="secondary">
              <X className="size-4" aria-hidden="true" />
              Cancel
            </Button>
          </Link>
        }
      />
      <MemoryForm />
    </main>
  );
}
