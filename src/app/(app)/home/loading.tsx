import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingHome() {
  return (
    <main className="animate-fadeUp" aria-busy="true" aria-live="polite">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Skeleton className="h-7 w-24 md:h-8 md:w-32" />
          <Skeleton className="mt-2 h-4 w-72 max-w-[70vw]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-9 w-32 rounded-xl md:block" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-10 w-24" />
          <Skeleton className="mt-3 h-4 w-48" />
        </Card>

        <Card>
          <Skeleton className="h-4 w-24" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-40" />
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-[220px]">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-4 w-44" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="mt-3 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl px-2 py-2">
                <Skeleton className="h-4 w-64 max-w-[70vw]" />
                <Skeleton className="mt-2 h-3 w-40" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="mt-3 rounded-xl bg-blush-500/10 p-3">
            <Skeleton className="h-4 w-56 max-w-[70vw]" />
            <Skeleton className="mt-2 h-3 w-44" />
          </div>
        </Card>
      </div>

      <div className="mt-3 md:hidden">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </main>
  );
}
