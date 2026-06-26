import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import type { Profile } from "@/lib/types";
import { safeProfile } from "@/lib/defaults";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!rawProfile) redirect("/login");

  const profile = safeProfile(rawProfile) as Profile;

  return (
    <div className="relative min-h-screen lg:flex">
      {/* grid backdrop, same as landing */}
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />

      <DashboardNav profile={profile as Profile} />
      <main className="relative flex-1 px-5 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
