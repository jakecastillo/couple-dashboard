import { Suspense } from "react";

import AuthClientPage from "./auth-client";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10">
          <div className="w-full rounded-2xl border border-white/50 bg-white/70 p-5 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/50">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">
              Sign in
            </h1>
          </div>
        </main>
      }
    >
      <AuthClientPage />
    </Suspense>
  );
}
