import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Book } from "@/lib/types";
import { hasSupabaseEnv } from "@/lib/env";
import { mockBooks } from "@/lib/mock-data";

function normalizeBook(book: Partial<Book> & { id: string }): Book {
  return {
    id: book.id,
    title: book.title ?? "Untitled",
    author: book.author ?? "Unknown Author",
    description: book.description ?? "",
    cover_url: book.cover_url ?? "",
    file_url: book.file_url ?? "#",
    category: book.category ?? "General",
    tags: Array.isArray(book.tags) ? book.tags : [],
    language: book.language ?? "English",
    pages: book.pages ?? 0,
    format: book.format ?? "PDF",
    featured_label: book.featured_label ?? null,
    rating: typeof book.rating === "number" ? book.rating : 0,
    is_published: Boolean(book.is_published),
    created_at: book.created_at ?? new Date().toISOString()
  };
}

function sortBooks(books: Book[]) {
  return books.sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  );
}

export const getBooks = cache(async () => {
  if (!hasSupabaseEnv) {
    return sortBooks(mockBooks.filter((book) => book.is_published));
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return sortBooks(mockBooks.filter((book) => book.is_published));
  }

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return sortBooks(mockBooks.filter((book) => book.is_published));
  }

  return data.map((book) => normalizeBook(book as Book));
});

export const getBookById = cache(async (id: string) => {
  if (!hasSupabaseEnv) {
    return mockBooks.find((book) => book.id === id) ?? null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return mockBooks.find((book) => book.id === id) ?? null;
  }

  const { data, error } = await supabase.from("books").select("*").eq("id", id).single();

  if (error || !data) {
    return mockBooks.find((book) => book.id === id) ?? null;
  }

  return normalizeBook(data as Book);
});

export const getAdminBooks = cache(async () => {
  if (!hasSupabaseEnv) {
    return sortBooks([...mockBooks]);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return sortBooks([...mockBooks]);
  }

  const { data, error } = await supabase.from("books").select("*").order("created_at", {
    ascending: false
  });

  if (error || !data) {
    return sortBooks([...mockBooks]);
  }

  return data.map((book) => normalizeBook(book as Book));
});
