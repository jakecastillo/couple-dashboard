import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingNotes() {
  return (
    <main className="animate-fadeUp" aria-busy="true" aria-live="polite">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Skeleton className="h-7 w-20 md:h-8 md:w-28" />
          <Skeleton className="mt-2 h-4 w-48 max-w-[70vw]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-16 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-3">
            <Skeleton className="h-4 w-56 max-w-[70vw]" />
            <Skeleton className="mt-2 h-3 w-40" />
          </Card>
        ))}
      </div>
    </main>
  );
}
