"use server";

import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/admin";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildLoginRedirect(error: string) {
  const searchParams = new URLSearchParams({ error });
  return `/admin/login?${searchParams.toString()}`;
}

export async function signInAdmin(formData: FormData) {
  if (!hasSupabaseEnv) {
    redirect(buildLoginRedirect("Add Supabase env vars before using admin authentication."));
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(buildLoginRedirect("Email and password are required."));
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(buildLoginRedirect("Supabase is not configured correctly."));
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(buildLoginRedirect(error.message));
  }

  if (!isAdminEmail(data.user?.email)) {
    await supabase.auth.signOut();
    redirect(buildLoginRedirect("This account is authenticated but not allowed to access admin."));
  }

  redirect("/admin/dashboard");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}
