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
    icon: "M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 3h14v2H5v-2z",
  },
  {
    id: "staff",
    label: "Staff",
    description: "A verified staff member trusted to moderate the platform.",
    rarity: "gold",
    icon: "M12 1l2.39 4.84L19.5 6.6l-3.75 3.66.89 5.16L12 12.98l-4.64 2.44.89-5.16L4.5 6.6l5.11-.76L12 1zM10.06 13.41L8.47 15l-3.06-3.06.71-.71L8.94 13l1.12-1.12.71.71zm4.95-1.41l-.71.71L16 14.41l-1.06 1.06-2.29-2.29.71-.71.71.71.95-.95z M10.7 12.7l-1.41-1.41L8 12.59l1.41 1.41L10.7 12.7zm5.59-1.41L18 13l-1.41 1.41L15 12.7l1.29-1.41z M9 12l2 2 4-4-1.5-1.5L11 11l-.5-.5L9 12z",
  },
  {
    id: "early",
    label: "Early Supporter",
    description: "Joined the platform during its very first month.",
    rarity: "emerald",
    icon: "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z",
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
