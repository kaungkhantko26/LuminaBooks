import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { BookTable } from "@/components/book-table";
import { requireAdminUser } from "@/lib/admin";
import { getAdminBooks } from "@/lib/books";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminBooksPage() {
  const previewMode = !hasSupabaseEnv;
  const adminUser = previewMode ? null : await requireAdminUser();
  const books = await getAdminBooks();

  return (
    <AdminShell
      title="Manage books"
      description="Edit metadata, inspect publishing status, and remove records from the catalog."
      previewMode={previewMode}
      adminEmail={adminUser?.email}
      actions={
        <Link
          href="/admin/books/new"
          className="rounded-full bg-brand-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[0.99]"
        >
          Add new book
        </Link>
      }
    >
      <BookTable books={books} previewMode={previewMode} />
    </AdminShell>
  );
}
