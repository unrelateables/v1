"use server";

import { createClient } from "@/lib/supabase/server";
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

  // Make sure username is not already taken
  const { data: existing, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  // If the profiles table itself is missing/broken, surface that clearly.
  if (lookupError) {
    fail(`Database not ready: ${lookupError.message}. Did you run the SQL migration?`);
  }
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

  // Set the chosen username on the auto-created profile row.
  if (data.user) {
    const { error: updError } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", data.user.id);

    if (updError) {
      // Profile row likely missing → the signup trigger didn't run.
      fail(
        `Account created, but profile setup failed: ${updError.message}. ` +
          "Please run the SQL migration in Supabase, then sign in."
      );
    }
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/signup?notice=check-email");
}
