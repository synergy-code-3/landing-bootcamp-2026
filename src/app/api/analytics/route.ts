import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const desde  = searchParams.get("desde");
  const hasta  = searchParams.get("hasta");
  const pais   = searchParams.get("pais");
  const device = searchParams.get("device");
  const source = searchParams.get("source");

  const { data, error } = await supabase.rpc("get_analytics", {
    p_slug:   "bootcamp-2026",
    p_desde:  desde  ? desde                : null,
    p_hasta:  hasta  ? hasta + "T23:59:59Z" : null,
    p_pais:   pais   ? pais                 : null,
    p_device: device ? device               : null,
    p_source: source ? source               : null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
