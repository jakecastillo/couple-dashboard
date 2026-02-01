import Link from "next/link";
import { ListChecks, X } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { WishlistForm } from "@/app/(app)/wishlist/new/WishlistForm";

export default function NewWishlistItemPage() {
  return (
    <main className="animate-fadeUp">
      <PageHeader
        title="New wishlist item"
        subtitle="Ideas → plans → little celebrations."
        icon={ListChecks}
        right={
          <Link href="/wishlist">
            <Button size="sm" variant="secondary">
              <X className="size-4" aria-hidden="true" />
              Cancel
            </Button>
          </Link>
        }
      />
      <WishlistForm />
    </main>
  );
}
