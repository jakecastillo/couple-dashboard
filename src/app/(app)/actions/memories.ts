"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState } from "@/app/(app)/actions/types";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

const memorySchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  memory_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD."),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  story: z.string().trim().max(5000).optional().or(z.literal(""))
});

export async function createMemoryAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fields = {
    title: readString(formData, "title"),
    memory_date: readString(formData, "memory_date"),
    location: readString(formData, "location"),
    story: readString(formData, "story")
  };

  try {
    const parsed = memorySchema.parse({
      title: fields.title,
      memory_date: fields.memory_date,
      location: fields.location,
      story: fields.story
    });

    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Not signed in.", fields };

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("couple_id")
      .eq("id", user.id)
      .single();
    if (profileError || !profile)
      return { ok: false, message: "Missing profile.", fields };

    const { data: inserted, error } = await supabase
      .from("memories")
      .insert({
        couple_id: profile.couple_id,
        title: parsed.title,
        memory_date: parsed.memory_date,
        location: parsed.location || null,
        story: parsed.story || null,
        created_by: user.id
      })
      .select("id")
      .single();

    if (error || !inserted)
      return { ok: false, message: error?.message ?? "Failed to save.", fields };
    return { ok: true, redirectTo: `/memories/${inserted.id}` };
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

const updateSchema = memorySchema.extend({
  id: z.string().uuid()
});

export async function updateMemoryAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fields = {
    id: readString(formData, "id"),
    title: readString(formData, "title"),
    memory_date: readString(formData, "memory_date"),
    location: readString(formData, "location"),
    story: readString(formData, "story")
  };

  try {
    const parsed = updateSchema.parse({
      id: fields.id,
      title: fields.title,
      memory_date: fields.memory_date,
      location: fields.location,
      story: fields.story
    });

    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Not signed in.", fields };

    const { error } = await supabase
      .from("memories")
      .update({
        title: parsed.title,
        memory_date: parsed.memory_date,
        location: parsed.location || null,
        story: parsed.story || null
      })
      .eq("id", parsed.id);

    if (error) return { ok: false, message: error.message, fields };
    revalidatePath("/home");
    revalidatePath("/memories");
    revalidatePath(`/memories/${parsed.id}`);
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

export async function deleteMemoryAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing memory id." };

  const supabase = await createSupabaseServerClient();
  // Best-effort storage cleanup.
  const { data: photos } = await supabase
    .from("memory_photos")
    .select("storage_path")
    .eq("memory_id", id);
  const paths = (photos ?? []).map((p) => p.storage_path);
  if (paths.length > 0) {
    await supabase.storage.from("memory-photos").remove(paths);
  }

  const { error } = await supabase.from("memories").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/home");
  revalidatePath("/memories");
  return { ok: true, redirectTo: "/memories" };
}

export async function deleteMemoryByIdAction(input: {
  id: string;
}): Promise<ActionState> {
  const id = String(input.id ?? "");
  if (!id) return { ok: false, message: "Missing memory id." };

  const supabase = await createSupabaseServerClient();

  // Best-effort storage cleanup.
  const { data: photos } = await supabase
    .from("memory_photos")
    .select("storage_path")
    .eq("memory_id", id);
  const paths = (photos ?? []).map((p) => p.storage_path);
  if (paths.length > 0) {
    await supabase.storage.from("memory-photos").remove(paths);
  }

  const { error } = await supabase.from("memories").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/home");
  revalidatePath("/memories");
  return { ok: true };
}

const addPhotoSchema = z.object({
  memoryId: z.string().uuid(),
  storagePath: z.string().min(1)
});

export async function addMemoryPhotoAction(input: {
  memoryId: string;
  storagePath: string;
}): Promise<ActionState> {
  try {
    const parsed = addPhotoSchema.parse(input);

    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Not signed in." };

    const { data: profile } = await supabase
      .from("profiles")
      .select("couple_id")
      .eq("id", user.id)
      .single();
    if (!profile) return { ok: false, message: "Missing profile." };

    const { error } = await supabase.from("memory_photos").insert({
      couple_id: profile.couple_id,
      memory_id: parsed.memoryId,
      storage_path: parsed.storagePath,
      created_by: user.id,
      caption: null
    });

    if (error) return { ok: false, message: error.message };
    revalidatePath(`/memories/${parsed.memoryId}`);
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError)
      return { ok: false, message: "Invalid upload payload." };
    return { ok: false, message: err instanceof Error ? err.message : "Upload failed." };
  }
}

export async function deleteMemoryPhotoAction(input: {
  photoId: string;
}): Promise<ActionState> {
  const photoId = String(input.photoId ?? "");
  if (!photoId) return { ok: false, message: "Missing photo id." };

  const supabase = await createSupabaseServerClient();
  const { data: photo } = await supabase
    .from("memory_photos")
    .select("storage_path")
    .eq("id", photoId)
    .single();

  if (photo?.storage_path) {
    await supabase.storage.from("memory-photos").remove([photo.storage_path]);
  }

  const { error } = await supabase.from("memory_photos").delete().eq("id", photoId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/memories");
  return { ok: true };
}
