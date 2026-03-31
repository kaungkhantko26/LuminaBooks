import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/site";

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
              <a href="/#request" className="transition hover:text-primary">
                Request
              </a>
            </nav>
          </div>
          <a
            href="/#request"
            className="hidden rounded-full bg-brand-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[0.99] md:inline-flex"
          >
            Request a Book
          </a>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <p className="bg-brand-gradient bg-clip-text font-heading text-2xl font-extrabold text-transparent">
              Lumina Library
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-on-surface-variant">
              Curated reading, smoother browsing, and direct requests for the next titles readers
              want to see in the archive.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">Explore</p>
            <div className="mt-4 space-y-3 text-sm font-semibold text-on-surface-variant">
              <Link href="/" className="block transition hover:text-primary">
                Home
              </Link>
              <a href="/#catalog" className="block transition hover:text-primary">
                Catalog
              </a>
              <a href="/#request" className="block transition hover:text-primary">
                Request a Book
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">Connect</p>
            <div className="mt-4 space-y-3 text-sm font-semibold text-on-surface-variant">
              <a
                href={siteConfig.creator.website}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-primary"
              >
                Website
              </a>
              <a
                href={siteConfig.creator.linkedin}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-primary"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.creator.github}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-primary"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-on-surface-variant lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>Requests go to {siteConfig.requestEmail}</p>
            <p>
              Built by{" "}
              <a
                href={siteConfig.creator.github}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary transition hover:text-secondary"
              >
                {siteConfig.creator.handle}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
