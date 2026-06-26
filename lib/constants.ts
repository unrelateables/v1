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
  /** Only admins can grant this badge. */
  adminOnly?: boolean;
  /** Awarded automatically based on profile state (never user-selectable). */
  auto?: boolean;
}

// Exclusive-feeling badges. All free for now.
export const BADGES: BadgeDef[] = [
  { id: "early", emoji: "👑", label: "Early Adopter", color: "#fbbf24", auto: true },
  { id: "verified", emoji: "✓", label: "Verified", color: "#3b82f6", adminOnly: true },
  { id: "creator", emoji: "🎨", label: "Creator", color: "#a78bfa" },
  { id: "dev", emoji: "💻", label: "Developer", color: "#22d3ee" },
  { id: "gamer", emoji: "🎮", label: "Gamer", color: "#f472b6" },
  { id: "music", emoji: "🎵", label: "Music Lover", color: "#34d399", auto: true },
  { id: "artist", emoji: "🖌️", label: "Artist", color: "#fb7185" },
  { id: "writer", emoji: "✍️", label: "Writer", color: "#fcd34d" },
  { id: "streamer", emoji: "📡", label: "Streamer", color: "#c084fc" },
  { id: "vibes", emoji: "✨", label: "Verified Vibes", color: "#f0abfc" },
  { id: "100views", emoji: "🔥", label: "100+ Views", color: "#fb923c", auto: true },
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
