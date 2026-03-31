import Image from "next/image";
import Link from "next/link";

import type { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/book/${book.id}`}
      className="group rounded-[2rem] bg-surface-container-lowest p-5 shadow-float transition duration-300 hover:-translate-y-2"
    >
      <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-surface-container">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-on-surface-variant">
            Cover unavailable
          </div>
        )}
        {book.featured_label ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary shadow-sm">
            {book.featured_label}
          </span>
        ) : null}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">{book.category}</p>
        <h3 className="font-heading text-xl font-bold text-on-surface">{book.title}</h3>
        <p className="text-sm font-medium text-on-surface-variant">{book.author}</p>
        <div className="flex items-center justify-between pt-2 text-sm text-on-surface-variant">
          <span>{book.format}</span>
          <span className="font-semibold text-primary">{book.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
