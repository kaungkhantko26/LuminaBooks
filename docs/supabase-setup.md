# Supabase Setup

## 1. Create the schema

Run the SQL in [`supabase/schema.sql`](../supabase/schema.sql).

## 2. Create storage buckets

Create these buckets in Supabase Storage:

- `book-covers`
- `book-files`

For the current starter, both buckets can be public. If you want private files later, keep
`book-files` private and swap download links to signed URLs generated in a route handler.

## 3. Create the admin account

Enable Email/Password auth and manually create a single admin user in Supabase Auth.

Then set:

```bash
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
```

Use a comma-separated list if you need more than one admin.

## 4. Add env vars

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
```

## 5. RLS model

- Public users can `select` only published books
- Authenticated admin users can `insert`, `update`, and `delete`

The starter uses an email allowlist in the app for admin UI access. The stronger production
version is to add an `is_admin` claim or profile table and reference that in RLS policies.
