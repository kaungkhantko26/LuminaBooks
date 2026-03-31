import { AdminShell } from "@/components/admin-shell";
import { BookForm } from "@/components/book-form";
import { requireAdminUser } from "@/lib/admin";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminNewBookPage() {
  const previewMode = !hasSupabaseEnv;
  const adminUser = previewMode ? null : await requireAdminUser();

  return (
    <AdminShell
      title="Add book"
      description="Upload the cover, store the file, and publish a new catalog entry from one form."
      previewMode={previewMode}
      adminEmail={adminUser?.email}
    >
      <BookForm mode="create" previewMode={previewMode} />
    </AdminShell>
  );
}
