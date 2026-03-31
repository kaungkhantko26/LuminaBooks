"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Book, BookFormValues } from "@/lib/types";
import { slugify } from "@/lib/utils";

type BookFormProps = {
  mode: "create" | "edit";
  book?: Book;
  previewMode: boolean;
};

function getInitialValues(book?: Book): BookFormValues {
  return {
    title: book?.title ?? "",
    author: book?.author ?? "",
    description: book?.description ?? "",
    category: book?.category ?? "",
    tags: book?.tags.join(", ") ?? "",
    language: book?.language ?? "English",
    pages: book?.pages ?? 0,
    format: book?.format ?? "PDF",
    featured_label: book?.featured_label ?? "",
    cover_url: book?.cover_url ?? "",
    file_url: book?.file_url ?? "",
    is_published: book?.is_published ?? true
  };
}

async function uploadFile(
  supabase: NonNullable<ReturnType<typeof createSupabaseBrowserClient>>,
  bucket: string,
  file: File,
  folder: string,
  title: string
) {
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${folder}/${slugify(title || file.name)}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function optimizeCoverImage(file: File) {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  if (file.type === "image/webp" && file.size <= 500 * 1024) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new window.Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error("Failed to process the cover image."));
      nextImage.src = objectUrl;
    });

    const maxWidth = 1200;
    const scale = image.width > maxWidth ? maxWidth / image.width : 1;
    const canvas = document.createElement("canvas");

    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d");

    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const optimizedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.82);
    });

    if (!optimizedBlob || optimizedBlob.size >= file.size) {
      return file;
    }

    const fileBaseName = file.name.replace(/\.[^.]+$/, "");
    return new File([optimizedBlob], `${fileBaseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now()
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function BookForm({ mode, book, previewMode }: BookFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<BookFormValues>(getInitialValues(book));
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const heading = useMemo(
    () => (mode === "create" ? "Register a new title" : "Update the existing record"),
    [mode]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Add Supabase env vars to enable uploads and database writes.");
      return;
    }

    setSaving(true);
    setStatus(coverFile ? "Optimizing cover image..." : "Preparing upload...");

    try {
      const optimizedCoverFile = coverFile ? await optimizeCoverImage(coverFile) : null;
      setStatus("Uploading files...");

      const [nextCoverUrl, nextFileUrl] = await Promise.all([
        optimizedCoverFile
          ? uploadFile(supabase, "book-covers", optimizedCoverFile, "covers", values.title)
          : Promise.resolve(values.cover_url),
        bookFile
          ? uploadFile(supabase, "book-files", bookFile, "files", values.title)
          : Promise.resolve(values.file_url)
      ]);

      const payload = {
        title: values.title,
        author: values.author,
        description: values.description,
        category: values.category,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        language: values.language,
        pages: Number(values.pages),
        format: values.format,
        featured_label: values.featured_label || null,
        cover_url: nextCoverUrl,
        file_url: nextFileUrl,
        is_published: values.is_published
      };
      setStatus("Saving book record...");

      const query =
        mode === "create"
          ? supabase.from("books").insert(payload)
          : supabase.from("books").update(payload).eq("id", book!.id);

      const { error: saveError } = await query;

      if (saveError) {
        throw saveError;
      }

      setStatus("Finishing...");
      setSuccess(mode === "create" ? "Book created successfully." : "Book updated successfully.");
      router.replace("/admin/books");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setSaving(false);
      setStatus(null);
    }
  }

  return (
    <div className="rounded-[2.5rem] bg-surface-container-lowest p-8 shadow-float lg:p-10">
      {previewMode ? (
        <div className="mb-6 rounded-[1.5rem] bg-primary-fixed px-5 py-4 text-sm text-on-surface">
          This form is fully wired for Supabase uploads and inserts, but it stays read-only until
          env vars are configured.
        </div>
      ) : null}

      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">
          {mode === "create" ? "Add Book" : "Edit Book"}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold text-on-surface">{heading}</h2>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Title
            </span>
            <input
              value={values.title}
              onChange={(event) => setValues({ ...values, title: event.target.value })}
              className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none"
              placeholder="The Architecture of Light"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Author
            </span>
            <input
              value={values.author}
              onChange={(event) => setValues({ ...values, author: event.target.value })}
              className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none"
              placeholder="Julian V. Sterling"
              required
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Category
            </span>
            <input
              value={values.category}
              onChange={(event) => setValues({ ...values, category: event.target.value })}
              className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none"
              placeholder="Technology"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Language
            </span>
            <input
              value={values.language}
              onChange={(event) => setValues({ ...values, language: event.target.value })}
              className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Pages
            </span>
            <input
              type="number"
              min={0}
              value={values.pages}
              onChange={(event) => setValues({ ...values, pages: Number(event.target.value) })}
              className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Description
          </span>
          <textarea
            value={values.description}
            onChange={(event) => setValues({ ...values, description: event.target.value })}
            className="min-h-36 w-full rounded-[1.5rem] border-0 bg-surface-container-low px-5 py-4 outline-none"
            placeholder="Write a strong editorial summary for the public detail page."
            required
          />
        </label>

        <div className="grid gap-6 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Format
            </span>
            <input
              value={values.format}
              onChange={(event) => setValues({ ...values, format: event.target.value })}
              className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none"
              placeholder="PDF, ePUB"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Featured Label
            </span>
            <input
              value={values.featured_label}
              onChange={(event) => setValues({ ...values, featured_label: event.target.value })}
              className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none"
              placeholder="New Arrival"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Tags
            </span>
            <input
              value={values.tags}
              onChange={(event) => setValues({ ...values, tags: event.target.value })}
              className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none"
              placeholder="AI, Design, Product"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block rounded-[2rem] border border-dashed border-outline-variant bg-surface-container-low p-5">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Cover Image
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
              className="mt-3 block w-full text-sm text-on-surface-variant"
            />
            <p className="mt-3 text-sm text-on-surface-variant">
              Current URL: {values.cover_url || "Will be generated after upload"}
            </p>
          </label>
          <label className="block rounded-[2rem] border border-dashed border-outline-variant bg-surface-container-low p-5">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Book File
            </span>
            <input
              type="file"
              accept=".pdf,.epub"
              onChange={(event) => setBookFile(event.target.files?.[0] ?? null)}
              className="mt-3 block w-full text-sm text-on-surface-variant"
            />
            <p className="mt-3 text-sm text-on-surface-variant">
              Current URL: {values.file_url || "Will be generated after upload"}
            </p>
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-[1.5rem] bg-surface-container-low px-5 py-4">
          <input
            type="checkbox"
            checked={values.is_published}
            onChange={(event) => setValues({ ...values, is_published: event.target.checked })}
            className="h-5 w-5 rounded border-none text-primary focus:ring-primary"
          />
          <span className="text-sm font-semibold text-on-surface">Published and visible on the public site</span>
        </label>

        {error ? (
          <div className="rounded-[1.5rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-[1.5rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}
        {status ? (
          <div className="rounded-[1.5rem] bg-surface-container px-4 py-3 text-sm font-medium text-on-surface-variant">
            {status}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-on-surface-variant">
            Storage uploads expect public buckets named `book-covers` and `book-files`. If you want
            private downloads later, replace the public URL call with signed URLs.
          </p>
          <button
            type="submit"
            disabled={saving || previewMode}
            className="rounded-full bg-brand-gradient px-8 py-4 font-bold text-white shadow-glow transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : mode === "create" ? "Create Book" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
