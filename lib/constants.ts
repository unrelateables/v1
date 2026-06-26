export const RESERVED_USERNAMES = [
  "admin",
  "root",
  "api",
  "dashboard",
  "login",
  "signup",
  "logout",
  "settings",
  "profile",
  "profiles",
  "links",
  "appearance",
  "www",
  "support",
  "help",
  "about",
  "privacy",
  "terms",
  "tos",
  "biolink",
  "me",
  "u",
  "user",
  "users",
  "new",
  "create",
  "edit",
  "delete",
  "admin-panel",
  "mod",
] as const;

export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export interface BadgeDef {
  id: string;
  emoji: string;
  label: string;
  color: string;
  gradient: [string, string];
  rare?: boolean;
}

// The single exclusive badge. Shown only on the owner's account.
export const OWNER_BADGE: BadgeDef = {
  id: "owner",
  emoji: "👑",
  label: "Owner",
  color: "#fbbf24",
  gradient: ["#f59e0b", "#fde68a"],
  rare: true,
};

export const BADGES = [OWNER_BADGE];

export function getBadge(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

export function isReservedUsername(username: string): boolean {
  return (RESERVED_USERNAMES as readonly string[]).includes(
    username.toLowerCase()
  );
}
