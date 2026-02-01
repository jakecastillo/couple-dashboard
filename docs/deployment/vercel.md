# Deploying to Vercel (with Supabase)

This app is a Next.js App Router project that uses Supabase Auth (email + password), Postgres (RLS), and Storage.

## 1) One-time Supabase setup

### Apply migrations + seed

This repo includes:

- Migrations: `supabase/migrations/`
- Seed: `supabase/seed.sql` (wired up via `supabase/config.toml`)

Using the Supabase CLI (recommended):

```bash
supabase link --project-ref <your-project-ref>
supabase db push --include-seed
```

Or run these in the Supabase SQL editor, in order:

- `supabase/migrations/20260201000000_init.sql`
- `supabase/migrations/20260201000001_storage.sql`
- `supabase/seed.sql`

### Configure Supabase Auth

In **Supabase → Authentication → Providers**, enable **Email** (email + password).

## 2) Create the Vercel project

1. In Vercel, **Add New → Project**, then import this repo.
2. Keep the defaults (Vercel should detect Next.js automatically).

## 3) Add Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

- `NEXT_PUBLIC_SUPABASE_URL` (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required)
- `SUPABASE_SERVICE_ROLE_KEY` (required; server-only, used to create allowlisted accounts)
- `COUPLE_ALLOWED_EMAILS` (recommended; comma-separated, exactly the two emails you want)
- `COUPLE_DISABLE_SEED` (optional; set `true` to disable starter content)
- `NEXT_PUBLIC_APP_NAME` (optional; e.g. `Couple Dashboard` — no quotes)

`SUPABASE_SERVICE_ROLE_KEY` must be set as an **Environment Variable** in Vercel (not a browser-exposed `NEXT_PUBLIC_*` var).

## 4) Deploy

Trigger a deploy (or push to your connected branch). After it finishes:

- Visit `https://<your-domain>/api/health`
- Sign in at `https://<your-domain>/auth` using an allowlisted email
- Verify core flows:
  - Home loads
  - Creating notes / wishlist items works
  - Uploading memory photos works (Supabase Storage bucket `memory-photos`)

## 5) Preview deployments (optional)

If you later add password reset emails, ensure your Supabase Auth URL config includes the correct redirect URL(s) for previews and production.

## Optional: auto-apply migrations on push (GitHub Actions)

If you want to automatically apply `supabase/migrations/*` to your Supabase project when you push to `main`, add this GitHub Actions workflow.

Create `.github/workflows/supabase-db-push.yml`:

```yaml
name: Supabase DB Push

on:
  push:
    branches: [main]
    paths:
      - "supabase/migrations/**"
      - "supabase/seed.sql"
      - "supabase/config.toml"

jobs:
  db-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Link project
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: supabase link --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}"

      - name: Push migrations + seed
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
        run: supabase db push --include-seed
```

Then add these GitHub repo secrets:

- `SUPABASE_ACCESS_TOKEN` (from Supabase account settings)
- `SUPABASE_PROJECT_REF` (your project ref)
- `SUPABASE_DB_PASSWORD` (project DB password)
