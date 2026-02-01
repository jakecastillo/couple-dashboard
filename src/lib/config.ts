export const AppMeta = {
  name: process.env["NEXT_PUBLIC_APP_NAME"] || "Couple Dashboard"
};

export function getConfiguredAllowedEmails(): string[] {
  const raw = process.env["COUPLE_ALLOWED_EMAILS"];
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isConfiguredSeedDisabled(): boolean {
  const raw = process.env["COUPLE_DISABLE_SEED"];
  if (!raw) return false;
  return raw === "1" || raw.toLowerCase() === "true" || raw.toLowerCase() === "yes";
}
