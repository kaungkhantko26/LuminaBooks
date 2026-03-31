"use client";

import { useMemo, useState } from "react";

import { BookCard } from "@/components/book-card";
import type { Book } from "@/lib/types";

export function DiscoverBooks({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(books.map((book) => book.category))],
    [books]
  );

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory = activeCategory === "All" || book.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [book.title, book.author, book.category, book.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, books, query]);

  return (
    <main>
      <section className="px-6 pb-16 pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-brand-gradient px-6 py-16 text-center shadow-glow md:px-14">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-white/80">
            The Digital Curator
          </p>
          <h1 className="mx-auto max-w-4xl font-heading text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Discover your next favorite book in a premium archive.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
            Search titles, authors, and categories while the public catalog and admin dashboard
            run from the same Supabase-backed source of truth.
          </p>
          <div className="mx-auto mt-10 max-w-2xl rounded-full bg-white/95 p-2 shadow-float">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, author, or category..."
              className="h-14 w-full rounded-full border-0 bg-transparent px-6 text-base text-on-surface outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      <section className="sticky top-[73px] z-40 px-6 pb-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl justify-center">
          <div className="flex max-w-full gap-3 overflow-x-auto rounded-full bg-white/85 p-3 shadow-float backdrop-blur-xl">
            {categories.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface-container text-on-surface-variant hover:bg-primary-fixed"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="catalog" className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-secondary">
                Public Catalog
              </p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold text-on-surface md:text-5xl">
                Curated for discovery
              </h2>
              <p className="mt-3 text-base text-on-surface-variant">
                The home page already supports client-side search and filtering. Swap mock data for
                Supabase credentials and the same UI begins reading from your live `books` table.
              </p>
            </div>
            <div className="rounded-full bg-surface-container px-5 py-2 text-sm font-semibold text-on-surface-variant">
              {filteredBooks.length} book{filteredBooks.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {filteredBooks.length === 0 ? (
            <div className="mt-12 rounded-[2rem] bg-surface-container-low p-12 text-center">
              <h3 className="font-heading text-2xl font-bold text-on-surface">No results found</h3>
              <p className="mt-3 text-on-surface-variant">
                Adjust the search term or switch categories to widen the catalog.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section id="community" className="px-6 pb-24 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 rounded-[3rem] bg-surface-container-low px-8 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">
              Build Order
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-on-surface md:text-4xl">
              Public UI, auth, admin CRUD, then polish.
            </h2>
            <p className="mt-4 text-base text-on-surface-variant">
              This scaffold follows that order, so you can connect Supabase once and keep building
              instead of reworking the routing later.
            </p>
          </div>
          <div className="grid gap-4 text-sm font-medium text-on-surface-variant sm:grid-cols-3">
            <div className="rounded-[2rem] bg-white px-5 py-6 shadow-sm">
              <p className="font-heading text-2xl font-bold text-primary">01</p>
              <p className="mt-2">Connect schema, buckets, and auth.</p>
            </div>
            <div className="rounded-[2rem] bg-white px-5 py-6 shadow-sm">
              <p className="font-heading text-2xl font-bold text-primary">02</p>
              <p className="mt-2">Use admin pages to add and edit books.</p>
            </div>
            <div className="rounded-[2rem] bg-white px-5 py-6 shadow-sm">
              <p className="font-heading text-2xl font-bold text-primary">03</p>
              <p className="mt-2">Publish titles to the public catalog.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
