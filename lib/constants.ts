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
    icon: "M5 16L3 5l5.5 4L12 4l3.5 5L21 5l-2 11H5zm0 2h14v2H5v-2z",
  },
  {
    id: "staff",
    label: "Staff",
    description: "A verified staff member trusted to moderate the platform.",
    rarity: "gold",
    icon: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
  },
  {
    id: "early",
    label: "Early Supporter",
    description: "Joined the platform during its very first month.",
    rarity: "emerald",
    icon: "M11 21h-1l1-7H7.5c-.88 0-.33-.49-.19-.74.85-1.54 3.17-5.52 5.69-10.26h1l-1 7h3.5c.48 0 .56.33.4.59C12.96 17.55 11 21 11 21z",
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
