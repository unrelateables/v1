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
  icon: string; // SVG path data (24x24 viewBox)
  label: string;
  color: string; // brand/border color
}

// guns.lol-style badges — clean text badges with branded border + icon
export const BADGES: BadgeDef[] = [
  {
    id: "owner",
    label: "Owner",
    color: "#fbbf24",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  },
  {
    id: "verified",
    label: "Verified",
    color: "#3b82f6",
    icon: "M12 2L9.5 4.5 6 4l-1 3.5L1.5 9 3 12l-1.5 3L5 16.5 6 20l3.5-.5L12 22l2.5-2.5L18 20l1-3.5L22.5 15 21 12l1.5-3L19 7.5 18 4l-3.5.5z M9.5 12.5l2 2 4-4",
  },
  {
    id: "premium",
    label: "Premium",
    color: "#a855f7",
    icon: "M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11z M5 19h14v2H5z",
  },
  {
    id: "early",
    label: "Early",
    color: "#10b981",
    icon: "M13 2L3 14h7l-1 8 10-12h-7z",
  },
];

export function getBadge(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

export function isReservedUsername(username: string): boolean {
  return (RESERVED_USERNAMES as readonly string[]).includes(
    username.toLowerCase()
  );
}
