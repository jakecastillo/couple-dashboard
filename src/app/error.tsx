"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl items-center px-4 py-10">
      <Card className="w-full">
        <div className="mb-4">
          <IconBadge
            icon={TriangleAlert}
            className="size-11 rounded-2xl"
            iconClassName="size-5"
          />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Try again — or head back home.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => reset()}>
            Try again
          </Button>
          <Link href="/home">
            <Button type="button" variant="secondary">
              Home
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
