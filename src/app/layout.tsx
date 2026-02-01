import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

import { AppMeta } from "@/lib/config";

export const metadata: Metadata = {
  title: AppMeta.name,
  description: "A private, premium couple dashboard."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="text-zinc-950 antialiased dark:text-zinc-50">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored ?? (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {}
})();`}
        </Script>
        <div className="noise pointer-events-none fixed inset-0 opacity-[0.06] dark:opacity-[0.05]" />
        <div className="relative min-h-dvh">{children}</div>
      </body>
    </html>
  );
}
