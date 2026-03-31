"use client";

import { FormEvent, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/site";

type RequestFormValues = {
  requester_name: string;
  requester_email: string;
  requested_title: string;
  requested_author: string;
  note: string;
};

const initialValues: RequestFormValues = {
  requester_name: "",
  requester_email: "",
  requested_title: "",
  requested_author: "",
  note: ""
};

function buildMailtoLink(values: RequestFormValues) {
  const searchParams = new URLSearchParams({
    subject: `Book request: ${values.requested_title}`,
    body: [
      `Name: ${values.requester_name}`,
      `Email: ${values.requester_email}`,
      `Requested title: ${values.requested_title}`,
      `Requested author: ${values.requested_author || "Not specified"}`,
      "",
      "Why this book matters:",
      values.note || "No extra details provided."
    ].join("\n")
  });

  return `mailto:${siteConfig.requestEmail}?${searchParams.toString()}`;
}

export function RequestBookForm() {
  const [values, setValues] = useState<RequestFormValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const mailtoLink = buildMailtoLink(values);
    const supabase = createSupabaseBrowserClient();

    try {
      if (!supabase) {
        window.location.href = mailtoLink;
        setMessage("Your email app was opened to send the request directly.");
        return;
      }

      const { error: insertError } = await supabase.from("book_requests").insert({
        requester_name: values.requester_name,
        requester_email: values.requester_email,
        requested_title: values.requested_title,
        requested_author: values.requested_author || null,
        note: values.note || null
      });

      if (insertError) {
        window.location.href = mailtoLink;
        setMessage("The request inbox was not ready, so your email app was opened instead.");
        return;
      }

      setValues(initialValues);
      setMessage("Book request sent. We will review it and update the catalog when possible.");
    } catch {
      window.location.href = mailtoLink;
      setError("We could not save the request directly, so we opened your email app instead.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Your Name
          </span>
          <input
            value={values.requester_name}
            onChange={(event) => setValues({ ...values, requester_name: event.target.value })}
            className="h-14 w-full rounded-[1.25rem] border-0 bg-white px-5 outline-none"
            placeholder="Kaung Khant Ko"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Email
          </span>
          <input
            type="email"
            value={values.requester_email}
            onChange={(event) => setValues({ ...values, requester_email: event.target.value })}
            className="h-14 w-full rounded-[1.25rem] border-0 bg-white px-5 outline-none"
            placeholder="reader@example.com"
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Book Title
          </span>
          <input
            value={values.requested_title}
            onChange={(event) => setValues({ ...values, requested_title: event.target.value })}
            className="h-14 w-full rounded-[1.25rem] border-0 bg-white px-5 outline-none"
            placeholder="The Design of Everyday Things"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Author
          </span>
          <input
            value={values.requested_author}
            onChange={(event) => setValues({ ...values, requested_author: event.target.value })}
            className="h-14 w-full rounded-[1.25rem] border-0 bg-white px-5 outline-none"
            placeholder="Don Norman"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
          Why Request It
        </span>
        <textarea
          value={values.note}
          onChange={(event) => setValues({ ...values, note: event.target.value })}
          className="min-h-32 w-full rounded-[1.5rem] border-0 bg-white px-5 py-4 outline-none"
          placeholder="Tell us why this book should be added to Lumina."
        />
      </label>

      {message ? (
        <div className="rounded-[1.5rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[1.5rem] bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-on-surface-variant">
          Requests are saved directly when the public request inbox is configured. Otherwise this
          form falls back to email so your request still reaches the library team.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-gradient px-8 py-4 font-bold text-white shadow-glow transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Sending..." : "Request This Book"}
        </button>
      </div>
    </form>
  );
}
