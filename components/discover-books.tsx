"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { BookCard } from "@/components/book-card";
import { RequestBookForm } from "@/components/request-book-form";
import type { Book } from "@/lib/types";

export function DiscoverBooks({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(
    () => ["All", ...new Set(books.map((book) => book.category))],
    [books]
  );

  const indexedBooks = useMemo(
    () =>
      books.map((book) => ({
        book,
        searchText: [book.title, book.author, book.category, book.description].join(" ").toLowerCase()
      })),
    [books]
  );

  const filteredBooks = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return indexedBooks
      .filter(({ book, searchText }) => {
      const matchesCategory = activeCategory === "All" || book.category === activeCategory;
      const matchesQuery =
          normalizedQuery.length === 0 || searchText.includes(normalizedQuery);

        return matchesCategory && matchesQuery;
      })
      .map(({ book }) => book);
  }, [activeCategory, deferredQuery, indexedBooks]);

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
                Explore a refined catalog of titles selected for readers who care about depth,
                design, and a calm reading experience.
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

      <section id="request" className="px-6 pb-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2.5rem] bg-brand-gradient p-8 text-white shadow-glow lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">
              Reader Requests
            </p>
            <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight md:text-5xl">
              Ask Lumina to source the next book for the shelf.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/85">
              If a title is missing from the archive, send a request with the book name, author,
              and why it matters. The team can review demand before curating the next release.
            </p>
            <div className="mt-8 rounded-[2rem] bg-white/12 p-5 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                What to include
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                <li>The exact title you want added</li>
                <li>The author or edition if you know it</li>
                <li>Why it belongs in the catalog</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-surface-container-low p-8 shadow-float lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-secondary">
              Submit Request
            </p>
            <h3 className="mt-3 font-heading text-3xl font-extrabold text-on-surface">
              Request a new book
            </h3>
            <p className="mt-3 text-base text-on-surface-variant">
              Send the request directly from the site. If the public inbox is not available yet,
              the form will open your email app as a backup.
            </p>

            <div className="mt-8">
              <RequestBookForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
