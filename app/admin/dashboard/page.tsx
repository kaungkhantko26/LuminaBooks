import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { requireAdminUser } from "@/lib/admin";
import { getAdminBooks } from "@/lib/books";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminDashboardPage() {
  const previewMode = !hasSupabaseEnv;
  const adminUser = previewMode ? null : await requireAdminUser();
  const books = await getAdminBooks();

  const publishedCount = books.filter((book) => book.is_published).length;
  const draftCount = books.length - publishedCount;
  const categories = new Set(books.map((book) => book.category)).size;

  return (
    <AdminShell
      title="Library overview"
      description="Track catalog health, recent uploads, and publishing status from a single admin surface."
      previewMode={previewMode}
      adminEmail={adminUser?.email}
      actions={
        <>
          <Link
            href="/admin/books"
            className="rounded-full bg-surface-container px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary-fixed"
          >
            Manage books
          </Link>
          <Link
            href="/admin/books/new"
            className="rounded-full bg-brand-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[0.99]"
          >
            Add new book
          </Link>
        </>
      }
    >
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 shadow-float">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-on-surface-variant">Total books</p>
          <p className="mt-4 font-heading text-5xl font-extrabold text-on-surface">{books.length}</p>
        </div>
        <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 shadow-float">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-on-surface-variant">Published</p>
          <p className="mt-4 font-heading text-5xl font-extrabold text-on-surface">{publishedCount}</p>
        </div>
        <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 shadow-float">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-on-surface-variant">Categories</p>
          <p className="mt-4 font-heading text-5xl font-extrabold text-on-surface">{categories}</p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 shadow-float">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Recent books</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-on-surface">
                Fresh catalog entries
              </h2>
            </div>
            <Link href="/admin/books" className="text-sm font-bold text-primary">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {books.slice(0, 4).map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-4 rounded-[2rem] bg-surface-container-low p-4"
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="h-20 w-14 rounded-2xl object-cover shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-lg font-bold text-on-surface">{book.title}</p>
                  <p className="text-sm text-on-surface-variant">
                    {book.author} · {book.category}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                    book.is_published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {book.is_published ? "Live" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 shadow-float">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Operational notes</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-on-surface-variant">
            <p>Draft titles are visible only in admin views until `is_published` is enabled.</p>
            <p>Delete currently removes the database row. Storage cleanup is the next safe upgrade.</p>
            <p>
              {previewMode
                ? "Supabase auth is skipped in preview mode so you can inspect the full UI before wiring credentials."
                : "Authenticated admin access is enforced by Supabase session checks and the email allowlist."}
            </p>
            <p>{draftCount} draft book{draftCount === 1 ? "" : "s"} currently need review.</p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
