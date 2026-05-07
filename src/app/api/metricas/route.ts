import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug        = searchParams.get("slug");
  const desde       = searchParams.get("desde");
  const hasta       = searchParams.get("hasta");
  const pais        = searchParams.get("pais");
  const dispositivo = searchParams.get("dispositivo");
  const fuente      = searchParams.get("fuente");

  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  const { data, error } = await supabase.rpc("get_metricas", {
    p_slug:        slug,
    p_desde:       desde       ? desde                    : null,
    p_hasta:       hasta       ? hasta + "T23:59:59Z"     : null,
    p_pais:        pais        ? pais                     : null,
    p_fuente:      fuente      ? fuente                   : null,
    p_dispositivo: dispositivo && dispositivo !== "Todos" ? dispositivo.toLowerCase().replace(/[^a-z]/g, "") : null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
