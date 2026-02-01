export function formatDate(dateIso: string) {
  const date = new Date(`${dateIso}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function daysSince(dateIso: string) {
  const start = new Date(`${dateIso}T00:00:00`);
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}
