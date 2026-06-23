export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const clsx = cn;

export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function hashIp(ip: string, salt = "biolink"): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getIpHashFromRequest(req: Request): Promise<string> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";
  return hashIp(ip);
}

export function parseEmbed(provider: string, raw: string): string | null {
  try {
    const url = new URL(raw);
    if (provider === "youtube") {
      const id =
        url.searchParams.get("v") ||
        url.pathname.split("/").filter(Boolean).pop() ||
        "";
      return /^[a-zA-Z0-9_-]{6,}$/.test(id) ? id : null;
    }
    if (provider === "spotify") {
      const match = url.pathname.match(/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
      return match ? `${match[1]}:${match[2]}` : null;
    }
    if (provider === "soundcloud") {
      return raw;
    }
    return raw;
  } catch {
    return null;
  }
}
