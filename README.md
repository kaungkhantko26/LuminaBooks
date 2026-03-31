# Lumina Library

Lumina Library is a starter for a mini SaaS-style book platform with:

- A public catalog with search and category filtering
- Book detail pages
- An admin login flow
- Admin CRUD forms for books
- Supabase-ready auth, database, and storage wiring

## Quick start

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Fill in your Supabase URL, anon key, and admin email
4. Run `npm run dev`
5. Open `http://localhost:3000`

Without env vars, the app still runs in preview mode using mock data.

## Routes

- `/` public catalog
- `/book/[id]` book detail
- `/admin/login` admin auth
- `/admin/dashboard` admin overview
- `/admin/books` manage books
- `/admin/books/new` add book
- `/admin/books/[id]/edit` edit book

## Supabase setup

- SQL schema: [`supabase/schema.sql`](./supabase/schema.sql)
- Setup notes: [`docs/supabase-setup.md`](./docs/supabase-setup.md)

## Current behavior

- Public pages read from Supabase when env vars exist, otherwise from mock data
- Admin pages require a logged-in allowlisted email when env vars exist
- Add and edit forms upload to `book-covers` and `book-files`
- Delete removes the book row; storage cleanup is intentionally left as a next step

# LuminaBooks
