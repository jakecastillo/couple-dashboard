import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingNoteDetail() {
  return (
    <main className="animate-fadeUp" aria-busy="true" aria-live="polite">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Skeleton className="h-7 w-64 max-w-[70vw] md:h-8" />
          <Skeleton className="mt-2 h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-16 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="md:col-span-2">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>

        <Card className="md:col-span-2">
          <Skeleton className="h-4 w-20" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="flex justify-end">
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
