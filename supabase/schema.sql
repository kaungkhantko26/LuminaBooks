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
