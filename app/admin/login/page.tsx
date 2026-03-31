import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getAdminUser } from "@/lib/admin";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminLoginPage() {
  const user = await getAdminUser();

  if (user) {
    redirect("/admin/dashboard");
  }

  return <LoginForm previewMode={!hasSupabaseEnv} />;
}
