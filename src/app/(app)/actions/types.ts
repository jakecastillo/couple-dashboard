"use server";

export type ActionState =
  | { ok: true; message?: string; redirectTo?: string; fields?: Record<string, string> }
  | { ok: false; message: string; fields?: Record<string, string> };
