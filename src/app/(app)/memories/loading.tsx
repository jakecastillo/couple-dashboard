import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingMemories() {
  return (
    <main className="animate-fadeUp" aria-busy="true" aria-live="polite">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Skeleton className="h-7 w-28 md:h-8 md:w-40" />
          <Skeleton className="mt-2 h-4 w-60 max-w-[70vw]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <Card className="mb-3">
        <div className="grid gap-2 md:grid-cols-[1fr_200px_auto] md:items-end">
          <div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-2 h-10 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-4 w-12" />
            <Skeleton className="mt-2 h-10 w-full rounded-xl" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-xl" />
            <Skeleton className="h-9 w-20 rounded-xl" />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {[2025, 2024].map((y) => (
          <div key={y}>
            <Skeleton className="mb-2 h-3 w-12" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/50"
                >
                  <Skeleton className="h-4 w-64 max-w-[70vw]" />
                  <Skeleton className="mt-2 h-3 w-40" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
