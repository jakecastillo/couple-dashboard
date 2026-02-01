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
  your_name: z.string().trim().max(80).optional().or(z.literal("")),
  partner_name: z.string().trim().max(80).optional().or(z.literal("")),
  anniversary_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD.")
    .optional()
    .or(z.literal(""))
});

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fields = {
    your_name: readString(formData, "your_name"),
    partner_name: readString(formData, "partner_name"),
    anniversary_date: readString(formData, "anniversary_date")
  };

  try {
    const parsed = schema.parse({
      your_name: fields.your_name,
      partner_name: fields.partner_name,
      anniversary_date: fields.anniversary_date
    });

    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Not signed in.", fields };

    const { error } = await supabase
      .from("profiles")
      .update({
        your_name: parsed.your_name || null,
        partner_name: parsed.partner_name || null,
        anniversary_date: parsed.anniversary_date || null
      })
      .eq("id", user.id);

    if (error) return { ok: false, message: error.message, fields };
    revalidatePath("/home");
    revalidatePath("/settings");
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
