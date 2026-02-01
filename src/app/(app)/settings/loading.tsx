import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingSettings() {
  return (
    <main className="animate-fadeUp" aria-busy="true" aria-live="polite">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Skeleton className="h-7 w-28 md:h-8 md:w-36" />
          <Skeleton className="mt-2 h-4 w-40 max-w-[70vw]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-2 h-4 w-44" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-10 w-full rounded-xl" />
              </div>
            ))}
            <div className="flex justify-end">
              <Skeleton className="h-9 w-20 rounded-xl" />
            </div>
          </div>
        </Card>

        <Card>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-4 w-28" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
        </Card>

        <Card className="md:col-span-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-4 w-80 max-w-[70vw]" />
          <div className="mt-3 space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </Card>

        <Card className="md:col-span-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-4 w-56 max-w-[70vw]" />
          <div className="mt-4">
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </Card>
      </div>
    </main>
  );
}
