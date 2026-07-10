import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/dashboard?discord_error=denied", request.url));
  }

  // state = profile_id|token  (we packed it in the connect button)
  const [profileId] = (state || "|").split("|");
  if (!profileId) {
    return NextResponse.redirect(new URL("/dashboard?discord_error=state", request.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/dashboard?discord_error=config", request.url));
  }

  const redirectUri = `${siteUrl}/api/discord/callback`;
  const tokenUrl = "https://discord.com/api/oauth2/token";

  // Exchange code for tokens
  const tokenRes = await fetch(tokenUrl, {
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
    return NextResponse.redirect(new URL("/dashboard?discord_error=token", request.url));
  }

  const tokens = await tokenRes.json();

  // Fetch Discord user profile
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL("/dashboard?discord_error=user", request.url));
  }

  const discordUser = await userRes.json();

  // Build avatar URL
  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${discordUser.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || "0") % 5}.png`;

  // Store in the user's profile settings
  const admin = createAdminClient();
  await admin
    .from("profile_settings")
    .upsert({
      profile_id: profileId,
      discord_id: discordUser.id,
      discord_username: discordUser.username,
      discord_display_name: discordUser.global_name || discordUser.username,
      discord_avatar: avatarUrl,
      discord_status: "online",
    })
    .eq("profile_id", profileId);

  return NextResponse.redirect(new URL("/dashboard?discord=connected", request.url));
}
