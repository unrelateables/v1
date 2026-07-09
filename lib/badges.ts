/**
 * The Owner badge is the only badge. It shows on exactly one account:
 * the owner. By default that's the admin role. To lock it to a single
 * specific account, set the OWNER_USER_ID env var to that user's UUID.
 */
export function getProfileBadges(profile: {
  id: string;
  role: string;
  created_at?: string;
}): string[] {
  const badges: string[] = [];

  // Owner badge — exactly one account
  const ownerId = process.env.OWNER_USER_ID;
  const isOwner = ownerId ? profile.id === ownerId : profile.role === "admin";
  if (isOwner) badges.push("owner");

  // Verified badge — admins
  if (profile.role === "admin") badges.push("verified");

  // Early supporter — anyone who signed up before end of 2026
  const created = profile.created_at || "";
  if (created && new Date(created).getFullYear() <= 2026) {
    badges.push("early");
  }

  return badges;
}
