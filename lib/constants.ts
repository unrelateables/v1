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
  /** Only admins can grant this badge. */
  adminOnly?: boolean;
  /** Awarded automatically based on profile state (never user-selectable). */
  auto?: boolean;
  /** Rare / premium-feeling styling (animated glow + ring). */
  rare?: boolean;
}

// Exclusive-feeling badges. All free for now.
export const BADGES: BadgeDef[] = [
  {
    id: "early",
    emoji: "👑",
    label: "Early Adopter",
    color: "#fbbf24",
    gradient: ["#f59e0b", "#fde68a"],
    auto: true,
    rare: true,
  },
  {
    id: "verified",
    emoji: "✓",
    label: "Verified",
    color: "#3b82f6",
    gradient: ["#2563eb", "#60a5fa"],
    adminOnly: true,
    rare: true,
  },
  { id: "creator", emoji: "🎨", label: "Creator", color: "#a78bfa", gradient: ["#7c3aed", "#c4b5fd"] },
  { id: "dev", emoji: "💻", label: "Developer", color: "#22d3ee", gradient: ["#0891b2", "#67e8f9"] },
  { id: "gamer", emoji: "🎮", label: "Gamer", color: "#f472b6", gradient: ["#db2777", "#f9a8d4"] },
  {
    id: "music",
    emoji: "🎵",
    label: "Music Lover",
    color: "#34d399",
    gradient: ["#059669", "#6ee7b7"],
    auto: true,
  },
  { id: "artist", emoji: "🖌️", label: "Artist", color: "#fb7185", gradient: ["#e11d48", "#fda4af"] },
  { id: "writer", emoji: "✍️", label: "Writer", color: "#fcd34d", gradient: ["#d97706", "#fde68a"] },
  { id: "streamer", emoji: "📡", label: "Streamer", color: "#c084fc", gradient: ["#9333ea", "#e9d5ff"] },
  { id: "vibes", emoji: "✨", label: "Verified Vibes", color: "#f0abfc", gradient: ["#c026d3", "#f5d0fe"] },
  {
    id: "100views",
    emoji: "🔥",
    label: "100+ Views",
    color: "#fb923c",
    gradient: ["#ea580c", "#fdba74"],
    auto: true,
    rare: true,
  },
];

export const SELECTABLE_BADGES = BADGES.filter((b) => !b.auto);

export function getBadge(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

export function isReservedUsername(username: string): boolean {
  return (RESERVED_USERNAMES as readonly string[]).includes(
    username.toLowerCase()
  );
}
