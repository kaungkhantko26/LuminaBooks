import Link from "next/link";
import { notFound } from "next/navigation";

import { BookCard } from "@/components/book-card";
import { SiteShell } from "@/components/site-shell";
import { getBookById, getBooks } from "@/lib/books";

export default async function BookDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [book, books] = await Promise.all([getBookById(id), getBooks()]);

  if (!book || (!book.is_published && !books.find((entry) => entry.id === id))) {
    notFound();
  }

  const relatedBooks = books.filter((entry) => entry.id !== book.id).slice(0, 3);

  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-8">
        <nav className="mb-10 flex items-center gap-2 text-sm font-medium text-on-surface-variant">
          <Link href="/" className="transition hover:text-primary">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-primary">{book.title}</span>
        </nav>

        <section className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-primary/15 blur-[90px]" />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-glow">
              <img src={book.cover_url} alt={book.title} className="aspect-[3/4] w-full object-cover" />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-secondary">
                {book.category}
              </p>
              <h1 className="mt-4 font-heading text-5xl font-extrabold leading-tight text-on-surface md:text-6xl">
                {book.title}
              </h1>
              <p className="mt-4 text-2xl font-medium text-primary">by {book.author}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Language
                </p>
                <p className="mt-2 font-heading text-xl font-bold text-on-surface">{book.language}</p>
              </div>
              <div className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Length
                </p>
                <p className="mt-2 font-heading text-xl font-bold text-on-surface">{book.pages} pages</p>
              </div>
              <div className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Format
                </p>
                <p className="mt-2 font-heading text-xl font-bold text-on-surface">{book.format}</p>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-surface-container-low p-8">
              <h2 className="font-heading text-2xl font-bold text-on-surface">Overview</h2>
              <p className="mt-4 text-lg leading-8 text-on-surface-variant">{book.description}</p>
              {book.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <a
                href={book.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-brand-gradient px-8 py-4 text-center font-bold text-white shadow-glow transition hover:scale-[0.99]"
              >
                Download now
              </a>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">
              Recommended
            </p>
            <h2 className="mt-3 font-heading text-4xl font-extrabold text-on-surface">
              Readers also explore
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {relatedBooks.map((relatedBook) => (
              <BookCard key={relatedBook.id} book={relatedBook} />
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
