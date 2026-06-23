"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidUrl } from "@/lib/utils";

async function getOwner(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function createLinkAction(formData: FormData) {
  const supabase = createClient();
  const user = await getOwner(supabase);
  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim().slice(0, 64);
  const url = String(formData.get("url") || "").trim();
  const icon = String(formData.get("icon") || "").trim().slice(0, 64) || null;

  if (!title) return { error: "Title is required." };
  if (!isValidUrl(url)) return { error: "Enter a valid URL (https://...)." };

  const { count } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const { error } = await supabase.from("links").insert({
    profile_id: user.id,
    title,
    url,
    icon,
    position: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/links");
  return { success: true };
}

export async function deleteLinkAction(formData: FormData) {
  const supabase = createClient();
  const user = await getOwner(supabase);
  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  await supabase.from("links").delete().eq("id", id).eq("profile_id", user.id);
  revalidatePath("/dashboard/links");
}

export async function updateLinkAction(formData: FormData) {
  const supabase = createClient();
  const user = await getOwner(supabase);
  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim().slice(0, 64);
  const url = String(formData.get("url") || "").trim();

  if (!title) return { error: "Title is required." };
  if (!isValidUrl(url)) return { error: "Enter a valid URL." };

  const { error } = await supabase
    .from("links")
    .update({ title, url })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/links");
  return { success: true };
}

export async function reorderLinksAction(orderedIds: string[]) {
  const supabase = createClient();
  const user = await getOwner(supabase);
  if (!user) redirect("/login");

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("links")
        .update({ position: index })
        .eq("id", id)
        .eq("profile_id", user.id)
    )
  );
  revalidatePath("/dashboard/links");
}
