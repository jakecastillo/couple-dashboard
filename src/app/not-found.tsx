import Link from "next/link";
import { MapPinOff } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl items-center px-4 py-10">
      <Card className="w-full">
        <div className="mb-4">
          <IconBadge
            icon={MapPinOff}
            className="size-11 rounded-2xl"
            iconClassName="size-5"
          />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          That page doesn’t exist — but you can always go back.
        </p>
        <div className="mt-4">
          <Link href="/home">
            <Button>Home</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
