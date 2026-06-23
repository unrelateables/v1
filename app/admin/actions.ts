"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");
  return supabase;
}

export async function banAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  await supabase.from("profiles").update({ banned: true }).eq("id", id);
  revalidatePath("/admin");
}

export async function unbanAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  await supabase.from("profiles").update({ banned: false }).eq("id", id);
  revalidatePath("/admin");
}

export async function resolveFlagAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  await supabase.from("flags").update({ resolved: true }).eq("id", id);
  revalidatePath("/admin");
}
