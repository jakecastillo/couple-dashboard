import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";

export default function ValentinePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-xl items-center py-10">
      <Card className="relative w-full overflow-hidden p-6">
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(248,77,124,0.18),transparent)] [background-size:200%_200%]" />
        <div className="relative">
          <div className="mx-auto">
            <IconBadge
              icon={Heart}
              className="mx-auto size-12 rounded-2xl bg-blush-500/10 text-blush-600 dark:text-blush-300"
              iconClassName="size-6 animate-float"
            />
          </div>
          <h1 className="mt-4 text-balance text-center text-2xl font-semibold tracking-tight">
            Happy Valentine’s Day
          </h1>
          <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
            You make the ordinary feel like a small ceremony. Thank you for being my
            favorite place to land. Will you be my Valentine’s?
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/home">
              <Button>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
