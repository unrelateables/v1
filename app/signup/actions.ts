"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isReservedUsername, USERNAME_REGEX } from "@/lib/constants";

function fail(message: string) {
  redirect(`/signup?error=${encodeURIComponent(message)}`);
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "").trim();
  const origin = headers().get("origin") || "";

  if (username.length < 3 || username.length > 24 || !USERNAME_REGEX.test(username)) {
    fail("Username must be 3-24 chars: letters, numbers, underscore.");
  }
  if (isReservedUsername(username)) {
    fail("That username is reserved.");
  }

  const supabase = createClient();
  const admin = createAdminClient();

  // Make sure username is not already taken
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (existing) {
    fail("That username is already taken.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    fail(error.message || "Could not create account.");
  }

  const userId = data.user?.id;
  if (!userId) {
    redirect("/signup?notice=check-email");
  }

  // Create profile + settings using service role (no reliance on a trigger).
  const { error: profileErr } = await admin
    .from("profiles")
    .insert({ id: userId, username })
    .select()
    .single();
  if (profileErr) {
    // Roll back auth user if profile creation fails
    await admin.auth.admin.deleteUser(userId).catch(() => {});
    fail(`Profile setup failed: ${profileErr.message}`);
  }

  const { error: settingsErr } = await admin
    .from("profile_settings")
    .insert({ profile_id: userId });
  if (settingsErr) {
    await admin.from("profiles").delete().eq("id", userId).catch(() => {});
    await admin.auth.admin.deleteUser(userId).catch(() => {});
    fail(`Settings setup failed: ${settingsErr.message}`);
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/signup?notice=check-email");
}
