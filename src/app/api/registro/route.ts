import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

const GHL_API   = "https://services.leadconnectorhq.com";
const GHL_TOKEN = process.env.GHL_MEXICO_TOKEN!;
const GHL_LOC   = "QqNC3ZYbzQz5yIKP6Vpz";

// Custom field IDs en GHL México
const CF = {
  utm_source:   "ILc8jTcoEPJlHRUQ3jj8",
  utm_medium:   "z8X1tKrpPQoVW6rR8Exu",
  utm_campaign: "5WIEPyVk5m4VnOU4W9et",
  utm_content:  "bbUnC0bO1KeMx6214px0",
  utm_term:     "g1OoF6rkuD6SueDnjGb8",
  utm_ip:       "12amxR2lKRbIDHY7Ke7G",
  funnel:       "9eJBH0iG0S0DPtva5Kck", // site_source_name
};

async function upsertGHL(payload: {
  nombre: string; email: string; telefono: string; pais: string;
  utm_source: string; utm_medium: string; utm_campaign: string;
  utm_content: string; utm_term: string;
  ip_country: string; ip_city: string; ip_region: string; ip: string;
}) {
  const [firstName, ...rest] = payload.nombre.trim().split(" ");
  const lastName = rest.join(" ") || "";

  // E.164: conservar el + inicial y eliminar todo lo que no sea dígito
  const phone = payload.telefono.replace(/(?!^\+)[^\d]/g, "");

  const body = {
    locationId: GHL_LOC,
    firstName,
    lastName,
    email:      payload.email,
    phone,
    country:    payload.ip_country || payload.pais,
    city:       payload.ip_city,
    state:      payload.ip_region,
    tags:       ["bootcamp-2026-mx"],
    customFields: [
      { id: CF.utm_source,   value: payload.utm_source },
      { id: CF.utm_medium,   value: payload.utm_medium },
      { id: CF.utm_campaign, value: payload.utm_campaign },
      { id: CF.utm_content,  value: payload.utm_content },
      { id: CF.utm_term,     value: payload.utm_term },
      { id: CF.utm_ip,       value: payload.ip },
      { id: CF.funnel,       value: "bootcamp-2026" },
    ].filter((f) => f.value),
  };

  const res = await fetch(`${GHL_API}/contacts/upsert`, {
    method:  "POST",
    headers: {
      "Authorization": `Bearer ${GHL_TOKEN}`,
      "Content-Type":  "application/json",
      "Version":       "2021-07-28",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL upsert failed ${res.status}: ${text}`);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, email, telefono } = body;

  if (!nombre || !email || !telefono) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const ip_country = decodeURIComponent(req.headers.get("x-vercel-ip-country")        ?? "");
  const ip_city    = decodeURIComponent(req.headers.get("x-vercel-ip-city")           ?? "");
  const ip_region  = decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? "");
  const ip         = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  // 1. Guardar en Supabase
  const { error } = await supabase.from("registros").insert({
    funnel_slug:  "bootcamp-2026",
    nombre,
    email,
    telefono,
    utm_source:   body.utm_source   ?? "",
    utm_medium:   body.utm_medium   ?? "",
    utm_campaign: body.utm_campaign ?? "",
    utm_content:  body.utm_content  ?? "",
    utm_term:     body.utm_term     ?? "",
    user_agent:   req.headers.get("user-agent") ?? "",
    ip_country,
    ip_city,
    ip_region,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 2. Upsert en GHL México (no bloquea la respuesta si falla)
  upsertGHL({
    nombre, email, telefono, pais: body.pais ?? "",
    utm_source:   body.utm_source   ?? "",
    utm_medium:   body.utm_medium   ?? "",
    utm_campaign: body.utm_campaign ?? "",
    utm_content:  body.utm_content  ?? "",
    utm_term:     body.utm_term     ?? "",
    ip_country, ip_city, ip_region, ip,
  }).catch((err) => console.error("[GHL]", err));

  return NextResponse.json({ ok: true });
}
