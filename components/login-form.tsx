"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({ previewMode }: { previewMode: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable login.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-gradient-to-br from-[#6b38d4] via-[#7c4be0] to-[#f472b6] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-white/70">
            Lumina Library
          </p>
          <h1 className="mt-6 max-w-lg font-heading text-6xl font-extrabold leading-tight">
            Curate the archive without building a custom backend.
          </h1>
        </div>
        <div className="max-w-md rounded-[2rem] bg-white/10 p-6 backdrop-blur-xl">
          <p className="text-sm font-semibold text-white">Stack</p>
          <p className="mt-3 text-white/80">
            Next.js for routing, Supabase for auth and storage, and a shared design system for both
            the public site and admin CMS.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-xl rounded-[2.5rem] bg-surface-container-lowest p-8 shadow-float sm:p-10">
          <div className="mb-8">
            <Link
              href="/"
              className="bg-brand-gradient bg-clip-text font-heading text-2xl font-extrabold text-transparent"
            >
              Lumina Library
            </Link>
            <h2 className="mt-6 font-heading text-4xl font-extrabold text-on-surface">
              Admin sign in
            </h2>
            <p className="mt-3 text-on-surface-variant">
              Use the one admin email you created in Supabase Auth. The allowlist is controlled by
              `NEXT_PUBLIC_ADMIN_EMAILS`.
            </p>
          </div>

          {previewMode ? (
            <div className="mb-6 rounded-[1.5rem] bg-primary-fixed px-5 py-4 text-sm text-on-surface">
              Preview mode is active. The form is ready, but live auth will stay disabled until the
              env file is configured.
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none ring-0 transition focus:bg-white focus:shadow-sm"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold uppercase tracking-[0.22em] text-primary">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your secure password"
                className="h-14 w-full rounded-[1.25rem] border-0 bg-surface-container-low px-5 outline-none ring-0 transition focus:bg-white focus:shadow-sm"
                required
              />
            </label>

            {error ? (
              <div className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-gradient px-6 py-4 font-bold text-white shadow-glow transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Enter dashboard"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
