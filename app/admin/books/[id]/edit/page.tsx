import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { BookForm } from "@/components/book-form";
import { requireAdminUser } from "@/lib/admin";
import { getBookById } from "@/lib/books";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminEditBookPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const previewMode = !hasSupabaseEnv;
  const adminUser = previewMode ? null : await requireAdminUser();
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit book"
      description="Update metadata, swap uploads, and control whether the book is visible publicly."
      previewMode={previewMode}
      adminEmail={adminUser?.email}
    >
      <BookForm mode="edit" book={book} previewMode={previewMode} />
    </AdminShell>
  );
}
