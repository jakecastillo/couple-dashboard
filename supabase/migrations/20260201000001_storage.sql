-- Storage bucket + RLS policies for memory photos

insert into storage.buckets (id, name, public)
values ('memory-photos', 'memory-photos', false)
on conflict (id) do update set public = excluded.public;

-- Restrict objects to the current couple (path: <couple_id>/<memory_id>/<filename>)
drop policy if exists "memory_photos_objects_select" on storage.objects;
create policy "memory_photos_objects_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'memory-photos'
  and split_part(name, '/', 1) = public.current_couple_id()::text
);

drop policy if exists "memory_photos_objects_insert" on storage.objects;
create policy "memory_photos_objects_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'memory-photos'
  and split_part(name, '/', 1) = public.current_couple_id()::text
);

drop policy if exists "memory_photos_objects_update" on storage.objects;
create policy "memory_photos_objects_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'memory-photos'
  and split_part(name, '/', 1) = public.current_couple_id()::text
)
with check (
  bucket_id = 'memory-photos'
  and split_part(name, '/', 1) = public.current_couple_id()::text
);

drop policy if exists "memory_photos_objects_delete" on storage.objects;
create policy "memory_photos_objects_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'memory-photos'
  and split_part(name, '/', 1) = public.current_couple_id()::text
);
