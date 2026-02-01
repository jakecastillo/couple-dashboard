-- Couple Dashboard schema (Auth + Postgres + Storage)

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- Helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  couple_id uuid not null,
  your_name text,
  partner_name text,
  anniversary_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles
for delete
using (id = auth.uid());

create or replace function public.current_couple_id()
returns uuid
language sql
stable
as $$
  select couple_id from public.profiles where id = auth.uid()
$$;

-- Couple settings (shared per couple_id)
create table if not exists public.couple_settings (
  couple_id uuid primary key,
  allowlist_emails text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger couple_settings_set_updated_at
before update on public.couple_settings
for each row execute function public.set_updated_at();

alter table public.couple_settings enable row level security;

drop policy if exists "couple_settings_select" on public.couple_settings;
create policy "couple_settings_select"
on public.couple_settings
for select
using (couple_id = public.current_couple_id());

drop policy if exists "couple_settings_insert" on public.couple_settings;
create policy "couple_settings_insert"
on public.couple_settings
for insert
with check (couple_id = public.current_couple_id());

drop policy if exists "couple_settings_update" on public.couple_settings;
create policy "couple_settings_update"
on public.couple_settings
for update
using (couple_id = public.current_couple_id())
with check (couple_id = public.current_couple_id());

-- Memories
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null,
  title text not null,
  memory_date date not null,
  location text,
  story text,
  memory_year int generated always as (extract(year from memory_date)) stored,
  memory_month int generated always as (extract(month from memory_date)) stored,
  memory_day int generated always as (extract(day from memory_date)) stored,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memories_couple_date_idx on public.memories (couple_id, memory_date desc);
create index if not exists memories_couple_year_idx on public.memories (couple_id, memory_year desc);
create index if not exists memories_title_trgm_idx on public.memories using gin (title gin_trgm_ops);

create trigger memories_set_updated_at
before update on public.memories
for each row execute function public.set_updated_at();

alter table public.memories enable row level security;

drop policy if exists "memories_select_couple" on public.memories;
create policy "memories_select_couple"
on public.memories
for select
using (couple_id = public.current_couple_id());

drop policy if exists "memories_insert_couple" on public.memories;
create policy "memories_insert_couple"
on public.memories
for insert
with check (couple_id = public.current_couple_id() and created_by = auth.uid());

drop policy if exists "memories_update_couple" on public.memories;
create policy "memories_update_couple"
on public.memories
for update
using (couple_id = public.current_couple_id())
with check (couple_id = public.current_couple_id());

drop policy if exists "memories_delete_couple" on public.memories;
create policy "memories_delete_couple"
on public.memories
for delete
using (couple_id = public.current_couple_id());

-- Photos
create table if not exists public.memory_photos (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null,
  memory_id uuid not null references public.memories (id) on delete cascade,
  storage_path text not null,
  caption text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists memory_photos_memory_idx on public.memory_photos (memory_id);
create index if not exists memory_photos_couple_idx on public.memory_photos (couple_id);

alter table public.memory_photos enable row level security;

drop policy if exists "memory_photos_select_couple" on public.memory_photos;
create policy "memory_photos_select_couple"
on public.memory_photos
for select
using (couple_id = public.current_couple_id());

drop policy if exists "memory_photos_insert_couple" on public.memory_photos;
create policy "memory_photos_insert_couple"
on public.memory_photos
for insert
with check (couple_id = public.current_couple_id() and created_by = auth.uid());

drop policy if exists "memory_photos_delete_couple" on public.memory_photos;
create policy "memory_photos_delete_couple"
on public.memory_photos
for delete
using (couple_id = public.current_couple_id());

-- Wishlist
create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null,
  title text not null,
  category text not null check (category in ('date_night','trip','gift','food','someday')),
  status text not null check (status in ('idea','planned','done')) default 'idea',
  notes text,
  target_date date,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wishlist_couple_status_date_idx on public.wishlist_items (couple_id, status, target_date);

create trigger wishlist_items_set_updated_at
before update on public.wishlist_items
for each row execute function public.set_updated_at();

alter table public.wishlist_items enable row level security;

drop policy if exists "wishlist_select_couple" on public.wishlist_items;
create policy "wishlist_select_couple"
on public.wishlist_items
for select
using (couple_id = public.current_couple_id());

drop policy if exists "wishlist_insert_couple" on public.wishlist_items;
create policy "wishlist_insert_couple"
on public.wishlist_items
for insert
with check (couple_id = public.current_couple_id() and created_by = auth.uid());

drop policy if exists "wishlist_update_couple" on public.wishlist_items;
create policy "wishlist_update_couple"
on public.wishlist_items
for update
using (couple_id = public.current_couple_id())
with check (couple_id = public.current_couple_id());

drop policy if exists "wishlist_delete_couple" on public.wishlist_items;
create policy "wishlist_delete_couple"
on public.wishlist_items
for delete
using (couple_id = public.current_couple_id());

-- Notes
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null,
  title text not null,
  body text not null,
  pinned boolean not null default false,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_couple_pinned_updated_idx on public.notes (couple_id, pinned desc, updated_at desc);

create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

alter table public.notes enable row level security;

drop policy if exists "notes_select_couple" on public.notes;
create policy "notes_select_couple"
on public.notes
for select
using (couple_id = public.current_couple_id());

drop policy if exists "notes_insert_couple" on public.notes;
create policy "notes_insert_couple"
on public.notes
for insert
with check (couple_id = public.current_couple_id() and created_by = auth.uid());

drop policy if exists "notes_update_couple" on public.notes;
create policy "notes_update_couple"
on public.notes
for update
using (couple_id = public.current_couple_id())
with check (couple_id = public.current_couple_id());

drop policy if exists "notes_delete_couple" on public.notes;
create policy "notes_delete_couple"
on public.notes
for delete
using (couple_id = public.current_couple_id());

-- Seed templates (read-only, used for "gifted" first login)
create table if not exists public.seed_templates (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('memory','wishlist_item','note')),
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.seed_templates enable row level security;

drop policy if exists "seed_templates_select_authenticated" on public.seed_templates;
create policy "seed_templates_select_authenticated"
on public.seed_templates
for select
using (auth.uid() is not null);

revoke insert, update, delete on public.seed_templates from authenticated;

-- Privileges (RLS still applies)
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.couple_settings to authenticated;
grant select, insert, update, delete on public.memories to authenticated;
grant select, insert, update, delete on public.memory_photos to authenticated;
grant select, insert, update, delete on public.wishlist_items to authenticated;
grant select, insert, update, delete on public.notes to authenticated;
grant select on public.seed_templates to authenticated;
