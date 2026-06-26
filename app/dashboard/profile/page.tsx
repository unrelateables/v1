import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfileEditPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="animate-fade-in">
      <p className="font-mono text-xs text-neutral-600">{"// profile"}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-neutral-500">
        How you appear on your public page.
      </p>
      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
