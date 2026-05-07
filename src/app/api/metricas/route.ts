import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

function groupCount<T>(arr: T[], key: (item: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of arr) {
    const k = key(item) || "Desconocido";
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug        = searchParams.get("slug");
  const desde       = searchParams.get("desde");
  const hasta       = searchParams.get("hasta");
  const pais        = searchParams.get("pais");
  const dispositivo = searchParams.get("dispositivo");
  const fuente      = searchParams.get("fuente");

  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  // ── Sesiones (visitantes) desde tabla sessions ──────────────
  let sesQuery = supabase
    .from("sessions")
    .select("session_id, visitor_id, device_type, os, browser, ip_country, ip_city, utm_source, is_bot, created_at")
    .eq("funnel_slug", slug)
    .eq("is_bot", false);

  if (desde)  sesQuery = sesQuery.gte("created_at", desde);
  if (hasta)  sesQuery = sesQuery.lte("created_at", hasta + "T23:59:59Z");
  if (pais)   sesQuery = sesQuery.eq("ip_country", pais);
  if (fuente) sesQuery = sesQuery.ilike("utm_source", `%${fuente}%`);
  if (dispositivo && dispositivo !== "Todos") sesQuery = sesQuery.eq("device_type", dispositivo);

  const { data: sesionesRaw, error: sesErr } = await sesQuery.limit(5000);
  if (sesErr) return NextResponse.json({ error: sesErr.message }, { status: 500 });

  const sesiones = sesionesRaw ?? [];

  const visitantesTipo    = groupCount(sesiones, (s) => s.device_type  || "Desconocido");
  const visitantesOS      = groupCount(sesiones, (s) => s.os           || "Desconocido");
  const visitantesBrowser = groupCount(sesiones, (s) => s.browser      || "Desconocido");
  const visitantesPais    = groupCount(sesiones, (s) => s.ip_country   || "Desconocido");
  const visitantesCiudad  = groupCount(sesiones, (s) => s.ip_city      || "Desconocido");
  const utmSources        = groupCount(
    sesiones.filter((s) => s.utm_source),
    (s) => s.utm_source
  );

  // ── Registros ───────────────────────────────────────────────
  let regQuery = supabase
    .from("registros")
    .select("id, user_agent, ip_country, ip_city, utm_source, created_at")
    .eq("funnel_slug", slug)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (desde)  regQuery = regQuery.gte("created_at", desde);
  if (hasta)  regQuery = regQuery.lte("created_at", hasta + "T23:59:59Z");
  if (pais)   regQuery = regQuery.eq("ip_country", pais);
  if (fuente) regQuery = regQuery.ilike("utm_source", `%${fuente}%`);

  const { data: registrosRaw } = await regQuery;
  let registros = (registrosRaw ?? []) as { id: string; user_agent: string; ip_country: string; ip_city: string; utm_source: string; created_at: string }[];

  // filtro dispositivo via user_agent si aplica (registros no tienen device_type)
  if (dispositivo && dispositivo !== "Todos") {
    const isMobile = /Mobile|Android|iPhone|iPod/i;
    const isTablet = /iPad|Tablet/i;
    registros = registros.filter((r) => {
      const ua = r.user_agent ?? "";
      if (dispositivo === "mobile")  return isMobile.test(ua) && !isTablet.test(ua);
      if (dispositivo === "tablet")  return isTablet.test(ua);
      if (dispositivo === "desktop") return !isMobile.test(ua) && !isTablet.test(ua);
      return true;
    });
  }

  const registradosPais   = groupCount(registros, (r) => r.ip_country || "Desconocido");
  const registradosCiudad = groupCount(registros, (r) => r.ip_city    || "Desconocido");

  return NextResponse.json({
    totalSesiones:  sesiones.length,
    totalRegistros: registros.length,
    tasaConversion: sesiones.length > 0
      ? ((registros.length / sesiones.length) * 100).toFixed(1)
      : "0",
    utmSources,
    visitantes: {
      tipo:    visitantesTipo,
      os:      visitantesOS,
      browser: visitantesBrowser,
      pais:    visitantesPais,
      ciudad:  visitantesCiudad,
    },
    registrados: {
      pais:   registradosPais,
      ciudad: registradosCiudad,
    },
  });
}
