"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Book } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BookTable({ books, previewMode }: { books: Book[]; previewMode: boolean }) {
  const [rows, setRows] = useState(books);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setError(null);

    if (!window.confirm("Delete this book record?")) {
      return;
    }

    if (previewMode) {
      setRows((currentRows) => currentRows.filter((row) => row.id !== id));
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase credentials are missing.");
      return;
    }

    const { error: deleteError } = await supabase.from("books").delete().eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
  }

  return (
    <div className="rounded-[2.5rem] bg-surface-container-lowest p-6 shadow-float lg:p-8">
      {error ? (
        <div className="mb-5 rounded-[1.5rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.26em] text-on-surface-variant">
              <th className="pb-4 pr-4">Book</th>
              <th className="pb-4 pr-4">Category</th>
              <th className="pb-4 pr-4">Status</th>
              <th className="pb-4 pr-4">Created</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((book) => (
              <tr key={book.id}>
                <td className="py-5 pr-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-12 overflow-hidden rounded-xl bg-surface-container shadow-sm">
                      {book.cover_url ? (
                        <Image
                          src={book.cover_url}
                          alt={book.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-1 text-center text-[10px] font-medium text-on-surface-variant">
                          No cover
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold text-on-surface">{book.title}</p>
                      <p className="text-sm text-on-surface-variant">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 pr-4 text-sm font-medium text-on-surface-variant">{book.category}</td>
                <td className="py-5 pr-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                      book.is_published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {book.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-5 pr-4 text-sm text-on-surface-variant">{formatDate(book.created_at)}</td>
                <td className="py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/books/${book.id}/edit`}
                      className="rounded-full bg-surface-container px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-fixed"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(book.id)}
                      className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <div className="py-10 text-center text-on-surface-variant">No books available.</div>
      ) : null}
    </div>
  );
}
