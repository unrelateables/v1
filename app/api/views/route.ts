import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getIpHashFromRequest } from "@/lib/utils";

export const runtime = "nodejs";

// POST /api/views?profile=<id>  — record one view (deduped per IP / 6h)
export async function POST(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get("profile");
  if (!profileId) {
    return NextResponse.json({ error: "missing profile" }, { status: 400 });
  }

  const ipHash = await getIpHashFromRequest(request);
  const since = new Date(Date.now() - 6 * 3600 * 1000).toISOString();

  const supabase = createAdminClient();

  // dedupe: ignore repeat views from same IP within 6h
  const { data: recent } = await supabase
    .from("views")
    .select("id")
    .eq("profile_id", profileId)
    .eq("ip_hash", ipHash)
    .gte("created_at", since)
    .limit(1);

  if (!recent || recent.length === 0) {
    await supabase.from("views").insert({ profile_id: profileId, ip_hash: ipHash });
  }

  return NextResponse.json({ ok: true });
}
