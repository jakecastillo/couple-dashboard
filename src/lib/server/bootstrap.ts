import "server-only";

import { getConfiguredAllowedEmails, isConfiguredSeedDisabled } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deterministicCoupleIdFromEmails } from "@/lib/server/couple";

type SeedTemplate = {
  kind: "memory" | "wishlist_item" | "note";
  payload: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const fallbackTemplates: SeedTemplate[] = [
  {
    kind: "memory",
    payload: {
      title: "The first coffee that felt like home",
      memory_date: "2021-03-14",
      location: "A quiet corner table",
      story:
        "We weren’t in a hurry. We just sat, talked, and made a small world feel soft."
    }
  },
  {
    kind: "memory",
    payload: {
      title: "The walk that turned into a tradition",
      memory_date: "2021-06-05",
      location: "Your favorite neighborhood loop",
      story: "Same streets, different sky. Somehow it always feels new with you."
    }
  },
  {
    kind: "memory",
    payload: {
      title: "A rainy day movie marathon",
      memory_date: "2022-11-19",
      location: "Living room",
      story: "Blankets, snacks, and the kind of laughter that makes the rain feel lucky."
    }
  },
  {
    kind: "memory",
    payload: {
      title: "The little celebration nobody else saw",
      memory_date: "2023-02-10",
      location: "Kitchen",
      story:
        "Just us, music low, a toast with whatever was in the fridge — perfect anyway."
    }
  },
  {
    kind: "memory",
    payload: {
      title: "A photo you took that I still replay",
      memory_date: "2024-09-22",
      location: "Somewhere sunny",
      story: "It’s funny how a single frame can hold a whole feeling."
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "A candlelit date night at home",
      category: "date_night",
      status: "planned",
      notes: "Cook together + playlist + no phones.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Weekend coastal drive",
      category: "trip",
      status: "idea",
      notes: "Pick a small town, stay somewhere cozy.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Try a new bakery every month",
      category: "food",
      status: "planned",
      notes: "Rate the croissants.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "A museum date with matching outfits",
      category: "date_night",
      status: "idea",
      notes: "Minimal, soft colors.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Make a photo book together",
      category: "gift",
      status: "idea",
      notes: "Pick 30 favorites and write tiny captions.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Picnic at sunset",
      category: "date_night",
      status: "planned",
      notes: "Bring something fizzy.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Learn one dance",
      category: "someday",
      status: "idea",
      notes: "Just one. Slowly.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Plan a surprise “yes day”",
      category: "date_night",
      status: "idea",
      notes: "One day of tiny yeses.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Try a tasting menu",
      category: "food",
      status: "idea",
      notes: "Dress up a little.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Leave each other handwritten notes",
      category: "gift",
      status: "planned",
      notes: "Hide them where we’ll find them later.",
      target_date: null
    }
  },
  {
    kind: "wishlist_item",
    payload: {
      title: "Book a tiny cabin for a night",
      category: "trip",
      status: "idea",
      notes: "Fireplace if possible.",
      target_date: null
    }
  },
  {
    kind: "note",
    payload: {
      title: "A tiny promise",
      body: "More “us” time. Less rushing. Always gentleness."
    }
  },
  {
    kind: "note",
    payload: {
      title: "What I love lately",
      body: "- The way you look when you’re thinking\n- Your laugh when you try not to\n- How safe it feels to be ordinary with you"
    }
  },
  {
    kind: "note",
    payload: {
      title: "Next date idea",
      body: "Pick a neighborhood we don’t know and wander until we find *our* spot."
    }
  },
  {
    kind: "note",
    payload: {
      title: "One-line gratitude",
      body: "Today I’m grateful for your steadiness."
    }
  },
  {
    kind: "note",
    payload: {
      title: "Home is a verb",
      body: "Let’s keep making it together — in little ways, every day."
    }
  }
];

export async function ensureBootstrapped() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  const allowedEmails = getConfiguredAllowedEmails();
  const coupleId = deterministicCoupleIdFromEmails(allowedEmails);

  const email = user.email ?? null;

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id,anniversary_date")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email,
      couple_id: coupleId,
      anniversary_date: "2021-02-14"
    });
  } else {
    await supabase
      .from("profiles")
      .update({
        email,
        couple_id: coupleId,
        anniversary_date: existingProfile.anniversary_date ?? "2021-02-14"
      })
      .eq("id", user.id);
  }

  await supabase
    .from("couple_settings")
    .upsert(
      { couple_id: coupleId, allowlist_emails: allowedEmails },
      { onConflict: "couple_id" }
    );

  if (isConfiguredSeedDisabled()) return;

  const [{ count: memoriesCount }, { count: wishlistCount }, { count: notesCount }] =
    await Promise.all([
      supabase.from("memories").select("id", { count: "exact", head: true }),
      supabase.from("wishlist_items").select("id", { count: "exact", head: true }),
      supabase.from("notes").select("id", { count: "exact", head: true })
    ]);

  const needsSeed =
    (memoriesCount ?? 0) < 1 || (wishlistCount ?? 0) < 1 || (notesCount ?? 0) < 1;
  if (!needsSeed) return;

  const { data: templates } = await supabase
    .from("seed_templates")
    .select("kind,payload")
    .returns<SeedTemplate[]>();

  const source = templates && templates.length > 0 ? templates : fallbackTemplates;
  const memoryTemplates = source.filter((t) => t.kind === "memory").map((t) => t.payload);
  const wishlistTemplates = source
    .filter((t) => t.kind === "wishlist_item")
    .map((t) => t.payload);
  const noteTemplates = source.filter((t) => t.kind === "note").map((t) => t.payload);

  if ((memoriesCount ?? 0) < 1 && memoryTemplates.length > 0) {
    const rows = memoryTemplates
      .map((payload) => {
        if (!isObject(payload)) return null;
        const title = typeof payload["title"] === "string" ? payload["title"] : null;
        const memory_date =
          typeof payload["memory_date"] === "string" ? payload["memory_date"] : null;
        if (!title || !memory_date) return null;
        return {
          couple_id: coupleId,
          title,
          memory_date,
          location: typeof payload["location"] === "string" ? payload["location"] : null,
          story: typeof payload["story"] === "string" ? payload["story"] : null,
          created_by: user.id
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));

    if (rows.length > 0) await supabase.from("memories").insert(rows);
  }

  if ((wishlistCount ?? 0) < 1 && wishlistTemplates.length > 0) {
    const rows = wishlistTemplates
      .map((payload) => {
        if (!isObject(payload)) return null;
        const title = typeof payload["title"] === "string" ? payload["title"] : null;
        const category =
          typeof payload["category"] === "string" ? payload["category"] : null;
        if (!title || !category) return null;
        return {
          couple_id: coupleId,
          title,
          category,
          status: typeof payload["status"] === "string" ? payload["status"] : "idea",
          notes: typeof payload["notes"] === "string" ? payload["notes"] : null,
          target_date:
            typeof payload["target_date"] === "string" ? payload["target_date"] : null,
          created_by: user.id
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));

    if (rows.length > 0) await supabase.from("wishlist_items").insert(rows);
  }

  if ((notesCount ?? 0) < 1 && noteTemplates.length > 0) {
    const rows = noteTemplates
      .map((payload) => {
        if (!isObject(payload)) return null;
        const title = typeof payload["title"] === "string" ? payload["title"] : null;
        const body = typeof payload["body"] === "string" ? payload["body"] : null;
        if (!title || !body) return null;
        return {
          couple_id: coupleId,
          title,
          body,
          pinned: false,
          created_by: user.id
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));

    if (rows.length > 0) await supabase.from("notes").insert(rows);
  }
}
