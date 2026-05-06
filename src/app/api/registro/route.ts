import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import supabase from "@/lib/db";

// ─── GHL ─────────────────────────────────────────────────────
const GHL_API   = "https://services.leadconnectorhq.com";
const GHL_TOKEN = process.env.GHL_MEXICO_TOKEN!;
const GHL_LOC   = "QqNC3ZYbzQz5yIKP6Vpz";

const CF = {
  utm_source:   "ILc8jTcoEPJlHRUQ3jj8",
  utm_medium:   "z8X1tKrpPQoVW6rR8Exu",
  utm_campaign: "5WIEPyVk5m4VnOU4W9et",
  utm_content:  "bbUnC0bO1KeMx6214px0",
  utm_term:     "g1OoF6rkuD6SueDnjGb8",
  utm_ip:       "12amxR2lKRbIDHY7Ke7G",
  funnel:       "9eJBH0iG0S0DPtva5Kck",
};

// ─── META CAPI ───────────────────────────────────────────────
const META_PIXEL_ID  = "559840393112703";
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN!;
const META_CAPI_URL  = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`;

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

// Mapa país → ISO 2 letras para matching de Meta
const COUNTRY_ISO: Record<string, string> = {
  "México": "mx", "Colombia": "co", "Argentina": "ar", "Chile": "cl",
  "Perú": "pe", "Venezuela": "ve", "Ecuador": "ec", "Guatemala": "gt",
  "Bolivia": "bo", "Rep. Dominicana": "do", "Honduras": "hn",
  "El Salvador": "sv", "Costa Rica": "cr", "Panamá": "pa",
  "Uruguay": "uy", "Paraguay": "py", "Nicaragua": "ni",
  "Estados Unidos": "us", "España": "es", "Canadá": "ca",
};

async function sendMetaCAPI(payload: {
  nombre: string; email: string; telefono: string; pais: string;
  utm_source: string; utm_medium: string; utm_campaign: string;
  utm_content: string; utm_term: string;
  ip: string; user_agent: string;
  fbc: string; fbp: string;
  event_id: string; event_source_url: string;
}) {
  const [firstName, ...rest] = payload.nombre.trim().split(" ");
  const lastName = rest.join(" ") || "";
  const phone = payload.telefono.replace(/(?!^\+)[^\d]/g, "");
  const countryIso = COUNTRY_ISO[payload.pais] ?? payload.pais.toLowerCase().slice(0, 2);

  const userData: Record<string, unknown> = {
    em: [sha256(payload.email)],
    ph: phone ? [sha256(phone)] : undefined,
    fn: firstName ? [sha256(firstName)] : undefined,
    ln: lastName ? [sha256(lastName)] : undefined,
    country: countryIso ? [sha256(countryIso)] : undefined,
    client_ip_address: payload.ip    || undefined,
    client_user_agent: payload.user_agent || undefined,
    fbc: payload.fbc || undefined,
    fbp: payload.fbp || undefined,
  };

  // Eliminar undefined
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);

  const event = {
    event_name:       "Lead",
    event_time:       Math.floor(Date.now() / 1000),
    event_id:         payload.event_id,
    event_source_url: payload.event_source_url || "https://bootcampsinergetico.com/",
    action_source:    "website",
    user_data:        userData,
    custom_data: {
      content_name:     "Bootcamp 2026",
      content_category: "bootcamp",
      currency:         "USD",
      value:            497,           // valor del ticket — ayuda al algoritmo de value-based optimization
      utm_source:       payload.utm_source   || undefined,
      utm_medium:       payload.utm_medium   || undefined,
      utm_campaign:     payload.utm_campaign || undefined,
      utm_content:      payload.utm_content  || undefined,
      utm_term:         payload.utm_term     || undefined,
      country:          payload.pais         || undefined,
    },
  };

  const res = await fetch(META_CAPI_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data:         [event],
      access_token: META_CAPI_TOKEN,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meta CAPI failed ${res.status}: ${text}`);
  }
}

// ─── GHL UPSERT ──────────────────────────────────────────────
async function upsertGHL(payload: {
  nombre: string; email: string; telefono: string; pais: string;
  utm_source: string; utm_medium: string; utm_campaign: string;
  utm_content: string; utm_term: string;
  ip_country: string; ip_city: string; ip_region: string; ip: string;
}) {
  const [firstName, ...rest] = payload.nombre.trim().split(" ");
  const lastName = rest.join(" ") || "";
  const phone = payload.telefono.replace(/(?!^\+)[^\d]/g, "");

  const body = {
    locationId: GHL_LOC,
    firstName,
    lastName,
    email:   payload.email,
    phone,
    country: payload.ip_country || payload.pais,
    city:    payload.ip_city,
    state:   payload.ip_region,
    tags:    ["bootcamp-2026-mx"],
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

// ─── HANDLER ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, email, telefono } = body;

  if (!nombre || !email || !telefono) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const ip_country   = decodeURIComponent(req.headers.get("x-vercel-ip-country")        ?? "");
  const ip_city      = decodeURIComponent(req.headers.get("x-vercel-ip-city")           ?? "");
  const ip_region    = decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? "");
  const ip           = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const user_agent   = req.headers.get("user-agent") ?? "";

  // 1. Supabase
  const { error } = await supabase.from("registros").insert({
    funnel_slug:  "bootcamp-2026",
    nombre, email, telefono,
    utm_source:   body.utm_source   ?? "",
    utm_medium:   body.utm_medium   ?? "",
    utm_campaign: body.utm_campaign ?? "",
    utm_content:  body.utm_content  ?? "",
    utm_term:     body.utm_term     ?? "",
    user_agent, ip_country, ip_city, ip_region,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 2. GHL México
  upsertGHL({
    nombre, email, telefono, pais: body.pais ?? "",
    utm_source:   body.utm_source   ?? "",
    utm_medium:   body.utm_medium   ?? "",
    utm_campaign: body.utm_campaign ?? "",
    utm_content:  body.utm_content  ?? "",
    utm_term:     body.utm_term     ?? "",
    ip_country, ip_city, ip_region, ip,
  }).catch((err) => console.error("[GHL]", err));

  // 3. Meta CAPI
  sendMetaCAPI({
    nombre, email, telefono, pais: body.pais ?? "",
    utm_source:   body.utm_source   ?? "",
    utm_medium:   body.utm_medium   ?? "",
    utm_campaign: body.utm_campaign ?? "",
    utm_content:  body.utm_content  ?? "",
    utm_term:     body.utm_term     ?? "",
    ip, user_agent,
    fbc:              body.fbc             ?? "",
    fbp:              body.fbp             ?? "",
    event_id:         body.event_id        ?? crypto.randomUUID(),
    event_source_url: body.event_source_url ?? "",
  }).catch((err) => console.error("[META CAPI]", err));

  return NextResponse.json({ ok: true });
}
