import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getAdminUser } from "@/lib/admin";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getAdminUser();
  const { error } = await searchParams;

  if (user) {
    redirect("/admin/dashboard");
  }

  return <LoginForm previewMode={!hasSupabaseEnv} errorMessage={error} />;
}
