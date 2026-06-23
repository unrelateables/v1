import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getIpHashFromRequest } from "@/lib/utils";

export const runtime = "nodejs";

// POST /api/clicks?link=<id> — record a link click (rate-limited per IP / 1h)
export async function POST(request: NextRequest) {
  const linkId = request.nextUrl.searchParams.get("link");
  if (!linkId) {
    return NextResponse.json({ error: "missing link" }, { status: 400 });
  }

  const ipHash = await getIpHashFromRequest(request);
  const since = new Date(Date.now() - 3600 * 1000).toISOString();

  const supabase = createAdminClient();

  const { data: recent } = await supabase
    .from("link_clicks")
    .select("id")
    .eq("link_id", linkId)
    .eq("ip_hash", ipHash)
    .gte("created_at", since)
    .limit(1);

  if (!recent || recent.length === 0) {
    await supabase.from("link_clicks").insert({ link_id: linkId, ip_hash: ipHash });
  }

  return NextResponse.json({ ok: true });
}
