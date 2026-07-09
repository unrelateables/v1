import { createClient } from "@/lib/supabase/server";
import { BADGES, RARITY_INFO } from "@/lib/constants";
import { getProfileBadges, getBadgeCounts } from "@/lib/badges";
import { BadgesClient } from "./badges-client";

export default async function BadgesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  const myBadges = getProfileBadges(profile);
  const counts = await getBadgeCounts();
  const equipped: string[] = profile.equipped_badges ?? myBadges;

  return (
    <BadgesClient
      earnedBadges={myBadges}
      equippedBadges={equipped}
      counts={counts}
    />
  );
}
