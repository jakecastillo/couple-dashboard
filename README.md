# Couple Dashboard

A private “Couple Dashboard” built on Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth + Postgres + Storage). Host-ready for Vercel.

## Features (MVP)

- Mobile-first UI with bottom navigation (Home, Memories, Wishlist, Notes) + safe-area handling
- Desktop layout with a cozy sidebar + 2-column content where it fits
- Supabase Auth (email + password)
- Hard allowlist: exactly 2 emails (configured via `COUPLE_ALLOWED_EMAILS`)
- RLS on every table + private storage bucket for memory photos
- Seeded “gifted” content on first login (memories, wishlist items, notes)
- Hidden route: `/valentine` (tasteful animated message card)
- Notes support Markdown + pinning
- Server Actions for writes + lightweight validation (Zod)
- `/api/health` endpoint

## Tech stack

- Next.js App Router + React Server Components
- TypeScript (strict)
- Tailwind CSS
- Supabase: Auth + Postgres + Storage
- `@supabase/ssr` middleware/session pattern

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Create a Supabase project

- Create a new project in Supabase.
- In **Authentication → Providers**, enable **Email** (email + password).

### 3) Configure env vars

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
COUPLE_ALLOWED_EMAILS=you@example.com,partner@example.com
# Optional: disable starter “gifted” content
COUPLE_DISABLE_SEED=true
```

### 4) Run migrations + seed

This repo includes migrations and a seed file in `supabase/`.

If you use the Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push --include-seed
```

Seed data is configured in `supabase/config.toml` under `[db.seed]` (this repo uses `supabase/seed.sql`).

If you don’t use the CLI, paste/run the SQL manually in the Supabase SQL editor:

- `supabase/migrations/20260201000000_init.sql`
- `supabase/migrations/20260201000001_storage.sql`
- `supabase/seed.sql`

### 5) Start the app

```bash
npm run dev
```

Visit `http://localhost:3000`, sign in with one of the allowlisted emails, and you should see gifted starter content on first login.

## Deployment (Vercel)

- Follow `docs/deployment/vercel.md` for a step-by-step checklist, plus an optional GitHub Action to apply migrations automatically.

## DevX

- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Format check: `npm run format`
- Format fix: `npm run format:fix`

### Pre-commit (Husky + lint-staged)

This repo includes `.husky/pre-commit`.

After installing deps, initialize husky once:

```bash
npx husky install
```

## Troubleshooting

If sign-in fails, confirm:

- The Supabase **Email** provider (email + password) is enabled.
- `COUPLE_ALLOWED_EMAILS` contains exactly 2 emails (comma-separated).

## Supabase schema

Tables (all with RLS enabled):

- `profiles`
- `couple_settings`
- `memories`
- `memory_photos`
- `wishlist_items`
- `notes`

Storage:

- Bucket: `memory-photos` (private)
- Path convention: `<couple_id>/<memory_id>/<filename>`
