"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import type { ActionState } from "@/app/(app)/actions/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

const categories = ["date_night", "trip", "gift", "food", "someday"] as const;
const statuses = ["idea", "planned", "done"] as const;

const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  category: z.enum(categories),
  status: z.enum(statuses).default("idea"),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  target_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD.")
    .optional()
    .or(z.literal(""))
});

export async function createWishlistItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fields = {
    title: readString(formData, "title"),
    category: readString(formData, "category"),
    status: readString(formData, "status"),
    notes: readString(formData, "notes"),
    target_date: readString(formData, "target_date")
  };

  try {
    const parsed = schema.parse({
      title: fields.title,
      category: fields.category,
      status: fields.status,
      notes: fields.notes,
      target_date: fields.target_date
    });

    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Not signed in.", fields };

    const { data: profile } = await supabase
      .from("profiles")
      .select("couple_id")
      .eq("id", user.id)
      .single();
    if (!profile) return { ok: false, message: "Missing profile.", fields };

    const { data: inserted, error } = await supabase
      .from("wishlist_items")
      .insert({
        couple_id: profile.couple_id,
        title: parsed.title,
        category: parsed.category,
        status: parsed.status,
        notes: parsed.notes || null,
        target_date: parsed.target_date || null,
        created_by: user.id
      })
      .select("id")
      .single();

    if (error || !inserted)
      return { ok: false, message: error?.message ?? "Failed to save.", fields };
    return { ok: true, redirectTo: "/wishlist" };
  } catch (err) {
    if (err instanceof z.ZodError)
      return {
        ok: false,
        message: err.errors[0]?.message ?? "Invalid input.",
        fields
      };
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Something went wrong."
    };
  }
}

const updateSchema = schema.extend({ id: z.string().uuid() });

export async function updateWishlistItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fields = {
    id: readString(formData, "id"),
    title: readString(formData, "title"),
    category: readString(formData, "category"),
    status: readString(formData, "status"),
    notes: readString(formData, "notes"),
    target_date: readString(formData, "target_date")
  };

  try {
    const parsed = updateSchema.parse({
      id: fields.id,
      title: fields.title,
      category: fields.category,
      status: fields.status,
      notes: fields.notes,
      target_date: fields.target_date
    });

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("wishlist_items")
      .update({
        title: parsed.title,
        category: parsed.category,
        status: parsed.status,
        notes: parsed.notes || null,
        target_date: parsed.target_date || null
      })
      .eq("id", parsed.id);

    if (error) return { ok: false, message: error.message, fields };
    revalidatePath("/home");
    revalidatePath("/wishlist");
    return { ok: true, message: "Saved." };
  } catch (err) {
    if (err instanceof z.ZodError)
      return {
        ok: false,
        message: err.errors[0]?.message ?? "Invalid input.",
        fields
      };
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Something went wrong."
    };
  }
}

export async function deleteWishlistItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing item id." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("wishlist_items").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/home");
  revalidatePath("/wishlist");
  return { ok: true };
}
