import { redirect } from "next/navigation";

import { getAdminAllowlist, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  const allowlist = getAdminAllowlist();

  if (allowlist.length === 0) {
    return true;
  }

  return allowlist.includes(email.toLowerCase());
}

export async function getAdminUser() {
  if (!hasSupabaseEnv) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
