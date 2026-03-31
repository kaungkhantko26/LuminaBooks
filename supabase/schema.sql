create extension if not exists "pgcrypto";

create table if not exists public.books (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  author text not null,
  description text not null default '',
  cover_url text not null default '',
  file_url text not null default '',
  category text not null default 'General',
  tags text[] not null default '{}',
  language text not null default 'English',
  pages integer not null default 0,
  format text not null default 'PDF',
  featured_label text,
  rating numeric not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.books enable row level security;

drop policy if exists "Public can read published books" on public.books;
create policy "Public can read published books"
on public.books
for select
using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert books" on public.books;
create policy "Authenticated users can insert books"
on public.books
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update books" on public.books;
create policy "Authenticated users can update books"
on public.books
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete books" on public.books;
create policy "Authenticated users can delete books"
on public.books
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'book-covers',
  'book-covers',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'book-files',
  'book-files',
  true,
  52428800,
  array['application/pdf', 'application/epub+zip']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view book covers" on storage.objects;
create policy "Public can view book covers"
on storage.objects
for select
using (bucket_id = 'book-covers');

drop policy if exists "Public can view book files" on storage.objects;
create policy "Public can view book files"
on storage.objects
for select
using (bucket_id = 'book-files');

drop policy if exists "Authenticated users can upload book covers" on storage.objects;
create policy "Authenticated users can upload book covers"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'book-covers');

drop policy if exists "Authenticated users can upload book files" on storage.objects;
create policy "Authenticated users can upload book files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'book-files');

drop policy if exists "Authenticated users can update book covers" on storage.objects;
create policy "Authenticated users can update book covers"
on storage.objects
for update
to authenticated
using (bucket_id = 'book-covers')
with check (bucket_id = 'book-covers');

drop policy if exists "Authenticated users can update book files" on storage.objects;
create policy "Authenticated users can update book files"
on storage.objects
for update
to authenticated
using (bucket_id = 'book-files')
with check (bucket_id = 'book-files');

drop policy if exists "Authenticated users can delete book covers" on storage.objects;
create policy "Authenticated users can delete book covers"
on storage.objects
for delete
to authenticated
using (bucket_id = 'book-covers');

drop policy if exists "Authenticated users can delete book files" on storage.objects;
create policy "Authenticated users can delete book files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'book-files');
