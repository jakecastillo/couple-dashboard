import { NextResponse } from "next/server";
import { z } from "zod";

import { getConfiguredAllowedEmails } from "@/lib/config";
import { normalizeEmail } from "@/lib/server/couple";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const allowedEmails = getConfiguredAllowedEmails();
  if (allowedEmails.length !== 2) {
    return NextResponse.json(
      { error: "Set COUPLE_ALLOWED_EMAILS to exactly 2 emails to enable registration." },
      { status: 503 }
    );
  }

  const email = normalizeEmail(parsed.data.email);
  if (!allowedEmails.includes(email)) {
    return NextResponse.json({ error: "Registration is disabled." }, { status: 403 });
  }

  if (!process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
    return NextResponse.json(
      {
        error: "Missing SUPABASE_SERVICE_ROLE_KEY (server-only) to enable registration."
      },
      { status: 503 }
    );
  }

  let supabaseAdmin: ReturnType<typeof createSupabaseAdminClient>;
  try {
    supabaseAdmin = createSupabaseAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Registration is not configured." },
      { status: 503 }
    );
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: parsed.data.password,
    email_confirm: true
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return NextResponse.json(
        { error: "Account already exists. Please sign in." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
