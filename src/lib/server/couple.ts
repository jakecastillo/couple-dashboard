import "server-only";

import crypto from "node:crypto";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function bytesToUuid(bytes: Uint8Array) {
  const hex = Buffer.from(bytes).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20
  )}-${hex.slice(20, 32)}`;
}

export function deterministicCoupleIdFromEmails(emails: string[]) {
  const normalized = emails.map(normalizeEmail).filter(Boolean).sort();
  if (normalized.length !== 2) {
    throw new Error("COUPLE_ALLOWED_EMAILS must contain exactly 2 emails.");
  }

  const digest = crypto.createHash("sha256").update(normalized.join("|")).digest();
  const bytes = new Uint8Array(digest.subarray(0, 16));

  // Make it UUIDv4-ish (set version + variant bits)
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}
