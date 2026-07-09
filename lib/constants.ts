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
  /** Approximate number of users who have this badge (for tooltip). */
  count: number;
}

export const BADGES: BadgeDef[] = [
  {
    id: "owner",
    label: "Owner",
    description: "The one who built this. Cannot be earned.",
    rarity: "diamond",
    count: 1,
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  },
  {
    id: "verified",
    label: "Verified",
    description: "Officially verified by the platform staff.",
    rarity: "gold",
    count: 3,
    icon: "M12 2L9.5 4.5 6 4l-1 3.5L1.5 9 3 12l-1.5 3L5 16.5 6 20l3.5-.5L12 22l2.5-2.5L18 20l1-3.5L22.5 15 21 12l1.5-3L19 7.5 18 4l-3.5.5z M9.5 12.5l2 2 4-4",
  },
  {
    id: "premium",
    label: "Premium",
    description: "Supports the platform with a premium membership.",
    rarity: "emerald",
    count: 12,
    icon: "M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11z M5 19h14v2H5z",
  },
  {
    id: "early",
    label: "Early Adopter",
    description: "Joined during the first wave of signups.",
    rarity: "iron",
    count: 47,
    icon: "M13 2L3 14h7l-1 8 10-12h-7z",
  },
  {
    id: "first-link",
    label: "First Link",
    description: "Added your very first link to your page.",
    rarity: "bronze",
    count: 128,
    icon: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  },
  {
    id: "100-views",
    label: "100 Views",
    description: "Your page reached 100 total views.",
    rarity: "gold",
    count: 8,
    icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z",
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
