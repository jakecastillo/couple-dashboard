import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingNewNote() {
  return (
    <main className="animate-fadeUp" aria-busy="true" aria-live="polite">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Skeleton className="h-7 w-40 md:h-8 md:w-56" />
          <Skeleton className="mt-2 h-4 w-44 max-w-[70vw]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <Card>
        <div className="space-y-3">
          <div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-2 h-10 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-2 h-40 w-full rounded-xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      </Card>
    </main>
  );
}
