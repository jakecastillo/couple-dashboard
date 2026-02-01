"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import type { ActionState } from "@/app/(app)/actions/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

const schema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120),
  body: z.string().trim().min(1, "Note body is required.").max(20000),
  pinned: z.string().optional()
});

export async function createNoteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fields = {
    title: readString(formData, "title"),
    body: readString(formData, "body"),
    pinned: formData.get("pinned") === "on" ? "on" : ""
  };

  try {
    const parsed = schema.parse({
      title: fields.title,
      body: fields.body,
      pinned: fields.pinned || undefined
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
      .from("notes")
      .insert({
        couple_id: profile.couple_id,
        title: parsed.title,
        body: parsed.body,
        pinned: parsed.pinned === "on",
        created_by: user.id
      })
      .select("id")
      .single();

    if (error || !inserted)
      return { ok: false, message: error?.message ?? "Failed to save.", fields };
    return { ok: true, redirectTo: `/notes/${inserted.id}` };
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

export async function updateNoteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fields = {
    id: readString(formData, "id"),
    title: readString(formData, "title"),
    body: readString(formData, "body"),
    pinned: formData.get("pinned") === "on" ? "on" : ""
  };

  try {
    const parsed = updateSchema.parse({
      id: fields.id,
      title: fields.title,
      body: fields.body,
      pinned: fields.pinned || undefined
    });

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("notes")
      .update({
        title: parsed.title,
        body: parsed.body,
        pinned: parsed.pinned === "on"
      })
      .eq("id", parsed.id);

    if (error) return { ok: false, message: error.message, fields };
    revalidatePath("/home");
    revalidatePath("/notes");
    revalidatePath(`/notes/${parsed.id}`);
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

export async function deleteNoteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing note id." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/home");
  revalidatePath("/notes");
  return { ok: true, redirectTo: "/notes" };
}

export async function deleteNoteByIdAction(input: { id: string }): Promise<ActionState> {
  const id = String(input.id ?? "");
  if (!id) return { ok: false, message: "Missing note id." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/home");
  revalidatePath("/notes");
  return { ok: true };
}

export async function togglePinNoteAction(input: {
  id: string;
  pinned: boolean;
}): Promise<ActionState> {
  const id = String(input.id ?? "");
  const pinned = Boolean(input.pinned);
  if (!id) return { ok: false, message: "Missing note id." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("notes").update({ pinned }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/home");
  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  return { ok: true };
}
