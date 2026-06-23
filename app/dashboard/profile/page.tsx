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
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-neutral-400">
        How you appear on your public page.
      </p>

      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
