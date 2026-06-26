/**
 * The Owner badge is the only badge. It shows on exactly one account:
 * the owner. By default that's the admin role. To lock it to a single
 * specific account, set the OWNER_USER_ID env var to that user's UUID.
 */
export function getProfileBadges(profile: {
  id: string;
  role: string;
}): string[] {
  const ownerId = process.env.OWNER_USER_ID;
  if (ownerId) {
    return profile.id === ownerId ? ["owner"] : [];
  }
  return profile.role === "admin" ? ["owner"] : [];
}
