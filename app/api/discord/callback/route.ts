import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/dashboard/settings?discord_error=denied", request.url));
  }

  // Get the logged-in user from their session cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({}) => {});
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // NEXT_PUBLIC_ vars are available on server too
  const clientId = process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/dashboard/settings?discord_error=config", request.url));
  }

  // Vercel terminates TLS before the function, so request.nextUrl.origin is http://
  // We must use https:// to match the authorize URL the browser generated
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
  const redirectUri = `${proto}://${host}/api/discord/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.error("Discord token error:", errText);
    return NextResponse.redirect(new URL(`/dashboard/settings?discord_error=token&msg=${encodeURIComponent(errText.slice(0, 100))}`, request.url));
  }

  const tokens = await tokenRes.json();

  // Fetch Discord user profile
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL("/dashboard/settings?discord_error=user", request.url));
  }

  const discordUser = await userRes.json();

  // Build avatar URL
  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${discordUser.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${(parseInt(discordUser.id) >> 22) % 6}.png`;

  // Store in the user's profile settings using admin client
  const admin = createAdminClient();
  await admin
    .from("profile_settings")
    .upsert({
      profile_id: user.id,
      discord_id: discordUser.id,
      discord_username: discordUser.username,
      discord_display_name: discordUser.global_name || discordUser.username,
      discord_avatar: avatarUrl,
      discord_status: "online",
    })
    .eq("profile_id", user.id);

  return NextResponse.redirect(new URL("/dashboard/settings?discord=connected", request.url));
}
