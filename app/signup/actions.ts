"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isReservedUsername, USERNAME_REGEX } from "@/lib/constants";

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "").trim();
  const origin = headers().get("origin") || "";

  if (username.length < 3 || username.length > 24 || !USERNAME_REGEX.test(username)) {
    redirect(`/signup?error=${encodeURIComponent("Username must be 3-24 chars: letters, numbers, underscore.")}`);
  }
  if (isReservedUsername(username)) {
    redirect(`/signup?error=${encodeURIComponent("That username is reserved.")}`);
  }

  const supabase = createClient();

  // Make sure username is not already taken
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (existing) {
    redirect(`/signup?error=${encodeURIComponent("That username is already taken.")}`);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Set the chosen username on the auto-created profile
  if (data.user) {
    await supabase
      .from("profiles")
      .update({ username })
      .eq("id", data.user.id);
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/signup?notice=check-email");
}
