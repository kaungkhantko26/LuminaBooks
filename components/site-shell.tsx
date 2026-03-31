import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="bg-brand-gradient bg-clip-text font-heading text-2xl font-extrabold text-transparent"
            >
              Lumina Library
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-on-surface-variant md:flex">
              <Link href="/" className="transition hover:text-primary">
                Home
              </Link>
              <a href="#catalog" className="transition hover:text-primary">
                Catalog
              </a>
              <a href="#community" className="transition hover:text-primary">
                Community
              </a>
            </nav>
          </div>
          <Link
            href="/admin/login"
            className="rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:scale-[0.98]"
          >
            Admin Sign In
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
