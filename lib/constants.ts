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

export type Rarity = "bronze" | "iron" | "gold" | "emerald" | "diamond";

export const RARITY_INFO: Record<
  Rarity,
  { label: string; color: string; border: string; glow: string; rank: number }
> = {
  bronze: {
    label: "Bronze",
    color: "#cd7f32",
    border: "#cd7f3255",
    glow: "rgba(205,127,50,0.3)",
    rank: 1,
  },
  iron: {
    label: "Iron",
    color: "#d1d5db",
    border: "#d1d5db55",
    glow: "rgba(209,213,219,0.25)",
    rank: 2,
  },
  gold: {
    label: "Gold",
    color: "#fbbf24",
    border: "#fbbf2455",
    glow: "rgba(251,191,36,0.4)",
    rank: 3,
  },
  emerald: {
    label: "Emerald",
    color: "#10b981",
    border: "#10b98155",
    glow: "rgba(16,185,129,0.4)",
    rank: 4,
  },
  diamond: {
    label: "Diamond",
    color: "#38bdf8",
    border: "#38bdf855",
    glow: "rgba(56,189,248,0.5)",
    rank: 5,
  },
};

export interface BadgeDef {
  id: string;
  icon: string;
  label: string;
  description: string;
  rarity: Rarity;
}

export const BADGES: BadgeDef[] = [
  {
    id: "owner",
    label: "Owner",
    description: "The person who owns and runs this platform. Cannot be earned.",
    rarity: "diamond",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  },
  {
    id: "staff",
    label: "Staff",
    description: "A verified staff member trusted to moderate the platform.",
    rarity: "gold",
    icon: "M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01z M9.5 12.5l1.5 1.5 3-3",
  },
  {
    id: "early",
    label: "Early Supporter",
    description: "Joined the platform during its very first month.",
    rarity: "emerald",
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
