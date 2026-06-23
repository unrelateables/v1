"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseEmbed } from "@/lib/utils";

export async function createEmbedAction(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const provider = String(formData.get("provider") || "custom") as
    | "youtube"
    | "spotify"
    | "soundcloud"
    | "custom";
  const raw = String(formData.get("url") || "").trim();

  if (!raw) return { error: "URL is required." };

  const embedId = parseEmbed(provider, raw);
  if (!embedId) {
    return { error: "Could not parse that embed URL for the chosen provider." };
  }

  const { count } = await supabase
    .from("embeds")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const { error } = await supabase.from("embeds").insert({
    profile_id: user.id,
    provider,
    embed_id: embedId,
    position: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/embeds");
  return { success: true };
}

export async function deleteEmbedAction(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  await supabase.from("embeds").delete().eq("id", id).eq("profile_id", user.id);
  revalidatePath("/dashboard/embeds");
}
