import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingWishlist() {
  return (
    <main className="animate-fadeUp" aria-busy="true" aria-live="polite">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Skeleton className="h-7 w-24 md:h-8 md:w-36" />
          <Skeleton className="mt-2 h-4 w-60 max-w-[70vw]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-16 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <div className="space-y-4">
        {["Planned", "Ideas"].map((label) => (
          <div key={label}>
            <Skeleton className="mb-2 h-3 w-16" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 w-64 max-w-[70vw]" />
                      <Skeleton className="mt-2 h-3 w-44" />
                    </div>
                    <Skeleton className="mt-0.5 h-6 w-16 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
