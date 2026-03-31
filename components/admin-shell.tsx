import Link from "next/link";
import type { ReactNode } from "react";

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
  previewMode?: boolean;
  adminEmail?: string | null;
};

export function AdminShell({
  title,
  description,
  children,
  actions,
  previewMode = false,
  adminEmail
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col justify-between bg-gradient-to-b from-[#6b38d4] to-[#4c22a3] px-6 py-8 text-white shadow-2xl lg:flex">
        <div>
          <div className="px-4">
            <p className="font-heading text-2xl font-bold">Lumina Admin</p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/60">Curator Portal</p>
          </div>
          <nav className="mt-12 space-y-2">
            <Link href="/admin/dashboard" className="block rounded-full px-4 py-3 font-semibold text-white/90 transition hover:bg-white/10">
              Dashboard
            </Link>
            <Link href="/admin/books" className="block rounded-full px-4 py-3 font-semibold text-white/90 transition hover:bg-white/10">
              Manage Books
            </Link>
            <Link href="/admin/books/new" className="block rounded-full px-4 py-3 font-semibold text-white/90 transition hover:bg-white/10">
              Add Book
            </Link>
            <Link href="/" className="block rounded-full px-4 py-3 font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
              View Public Site
            </Link>
          </nav>
        </div>
        <div className="rounded-[2rem] bg-white/10 p-5 backdrop-blur">
          <p className="text-sm font-semibold text-white">Signed in</p>
          <p className="mt-1 truncate text-sm text-white/70">{adminEmail ?? "Preview mode"}</p>
          <p className="mt-4 text-xs leading-6 text-white/60">
            CRUD actions are disabled until Supabase env vars are set and the admin account matches
            the allowlist.
          </p>
        </div>
      </aside>

      <main className="min-h-screen px-6 py-8 lg:ml-72 lg:px-10">
        {previewMode ? (
          <div className="mb-6 rounded-[2rem] border border-primary/15 bg-primary-fixed px-5 py-4 text-sm font-medium text-on-surface">
            Preview mode is active because Supabase env vars are missing. The public catalog falls
            back to mock data and admin mutations are disabled.
          </div>
        ) : null}

        <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl font-extrabold text-on-surface md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-base text-on-surface-variant">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </header>

        {children}
      </main>
    </div>
  );
}
