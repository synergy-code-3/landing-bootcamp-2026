"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { parseUA } from "@/lib/parseUA";

// ─── Palette (matching landing) ──────────────────────────────────────────────
const C = {
  bg:        "#000000",
  bgCard:    "#0a0a0a",
  bgSubtle:  "#111111",
  border:    "#1a1a1a",
  borderHi:  "rgba(0,224,64,0.25)",
  text:      "#ffffff",
  textMuted: "#999999",
  textDim:   "#666666",
  accent:    "#00e040",
  accentSoft:"rgba(0,224,64,0.08)",
  accentMid: "rgba(0,224,64,0.15)",
  gold:      "#d4a843",
  goldSoft:  "rgba(212,168,67,0.1)",
  danger:    "#ef4444",
  indigo:    "#818cf8",
};
const FONT_HEAD = "var(--font-head), system-ui, sans-serif";
const FONT_BODY = "var(--font-body), system-ui, sans-serif";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Funnel {
  slug: string;
  nombre: string;
  fb_pixel_id: string;
  fb_event_name: string;
  ghl_webhook: string;
  activo: boolean;
}

const FB_EVENTS = [
  "Lead", "CompleteRegistration", "Contact", "SubmitApplication",
  "Schedule", "StartTrial", "Subscribe", "Purchase",
];

interface Registro {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  ip_country: string;
  ip_city: string;
  user_agent: string;
  created_at: string;
}

interface Breakdown { label: string; count: number }

interface AudienciaData {
  tipo:    Breakdown[];
  os:      Breakdown[];
  browser: Breakdown[];
  pais:    Breakdown[];
  ciudad:  Breakdown[];
}

interface MetricasData {
  totalSesiones:   number;
  totalRegistros:  number;
  tasaConversion:  string;
  utmSources:      Breakdown[];
  visitantes:      AudienciaData;
  registrados:     AudienciaData;
}

interface AnalyticsData {
  totals: {
    sessions: number;
    conversions: number;
    conversion_rate: number;
    form_focus_rate: number;
    scroll50_rate: number;
    time60s_rate: number;
    avg_time_s: number;
    avg_scroll_pct: number;
    avg_clicks: number;
  };
  funnel: { step: string; count: number }[];
  sectionEngagement: { section: string; sessions_viewed: number; total_ms: number; avg_dwell_s: number; views: number }[];
  topClicks: { target: string; clicks: number; unique_sessions: number }[];
  segments: {
    device: Breakdown[];
    browser: Breakdown[];
    os: Breakdown[];
    country: Breakdown[];
    city: Breakdown[];
    utm_source: Breakdown[];
    utm_medium: Breakdown[];
    utm_campaign: Breakdown[];
    referrer: Breakdown[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" });
}

function fmtSec(s: number) {
  if (s < 60) return `${Math.round(s)}s`;
  const m = Math.floor(s / 60);
  const rest = Math.round(s % 60);
  return `${m}m ${rest}s`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, accent = C.accent, hint }: { label: string; value: string | number; accent?: string; hint?: string }) {
  return (
    <div style={{
      background: C.bgCard, border:`1px solid ${C.border}`, borderRadius:"14px",
      padding:"22px 24px", position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"3px", background: accent }}/>
      <p style={{
        color: C.textDim, fontSize:"11px", fontWeight:700, textTransform:"uppercase",
        letterSpacing:"0.14em", marginBottom:"10px", fontFamily: FONT_HEAD,
      }}>{label}</p>
      <p style={{
        color: C.text, fontSize:"2rem", fontWeight:800, fontFamily: FONT_HEAD, letterSpacing:"-0.02em",
      }}>{value}</p>
      {hint && <p style={{ color: C.textMuted, fontSize:"12px", marginTop:"4px" }}>{hint}</p>}
    </div>
  );
}

function BreakdownList({ items, label, color = C.accent }: { items: Breakdown[]; label: string; color?: string }) {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (items.length === 0) return null;
  return (
    <div style={{ background: C.bgCard, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"18px 20px" }}>
      <p style={{
        color: C.textMuted, fontSize:"11px", fontWeight:700, textTransform:"uppercase",
        letterSpacing:"0.14em", marginBottom:"14px", fontFamily: FONT_HEAD,
      }}>{label}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {items.slice(0, 8).map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                <span style={{ color: C.text, fontSize:"13px" }}>{item.label}</span>
                <span style={{ color, fontSize:"13px", fontWeight:700 }}>
                  {item.count}<span style={{ color: C.textDim, fontWeight:400, marginLeft:"4px" }}>({pct}%)</span>
                </span>
              </div>
              <div style={{ height:"4px", background:"rgba(255,255,255,0.05)", borderRadius:"2px" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:"2px", transition:"width 0.3s" }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      color: C.text, fontWeight:700, fontSize:"1.05rem", marginBottom:"14px",
      fontFamily: FONT_HEAD, letterSpacing:"-0.01em",
    }}>{children}</h3>
  );
}

function AudienciaPanel({ data, title, color }: { data: AudienciaData; title: string; color: string }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"14px" }}>
        <BreakdownList items={data.tipo}    label="Dispositivo" color={color} />
        <BreakdownList items={data.os}      label="Sistema operativo" color={color} />
        <BreakdownList items={data.browser} label="Navegador" color={color} />
        <BreakdownList items={data.pais}    label="País" color={color} />
        <BreakdownList items={data.ciudad}  label="Ciudad" color={color} />
      </div>
    </div>
  );
}

function FunnelChart({ steps }: { steps: { step: string; count: number }[] }) {
  const max = Math.max(...steps.map((s) => s.count), 1);
  return (
    <div style={{ background: C.bgCard, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px" }}>
      <SectionTitle>Embudo de conversión</SectionTitle>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {steps.map((s, i) => {
          const pct = (s.count / max) * 100;
          const rel = i > 0 && steps[i-1].count > 0 ? (s.count / steps[i-1].count) * 100 : 100;
          return (
            <div key={s.step}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"4px" }}>
                <span style={{ color: C.text, fontSize:"13px", fontWeight:600 }}>{s.step}</span>
                <span style={{ color: C.textMuted, fontSize:"12px" }}>
                  <span style={{ color: C.accent, fontWeight:700 }}>{s.count}</span>
                  {i > 0 && <span style={{ marginLeft:"8px", color: C.gold }}>{rel.toFixed(0)}%</span>}
                </span>
              </div>
              <div style={{ height:"22px", background:"rgba(255,255,255,0.04)", borderRadius:"6px", overflow:"hidden" }}>
                <div style={{
                  height:"100%", width:`${pct}%`,
                  background:`linear-gradient(90deg, ${C.accent}, ${C.accent}aa)`,
                  borderRadius:"6px", transition:"width 0.4s",
                }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarList({ title, items, color = C.accent, labelKey, countKey, secondaryKey, secondaryLabel }: {
  title: string;
  items: Array<Record<string, string | number>>;
  color?: string;
  labelKey: string;
  countKey: string;
  secondaryKey?: string;
  secondaryLabel?: string;
}) {
  if (!items.length) {
    return (
      <div style={{ background: C.bgCard, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px" }}>
        <SectionTitle>{title}</SectionTitle>
        <p style={{ color: C.textDim, fontSize:"13px" }}>Sin datos aún.</p>
      </div>
    );
  }
  const max = Math.max(...items.map((i) => Number(i[countKey]) || 0), 1);
  return (
    <div style={{ background: C.bgCard, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px" }}>
      <SectionTitle>{title}</SectionTitle>
      <div style={{ display:"flex", flexDirection:"column", gap:"9px" }}>
        {items.slice(0, 12).map((item, idx) => {
          const label = String(item[labelKey] ?? "—");
          const count = Number(item[countKey]) || 0;
          const pct   = (count / max) * 100;
          return (
            <div key={`${label}-${idx}`}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px", gap:"12px" }}>
                <span style={{
                  color: C.text, fontSize:"12.5px",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0,
                }} title={label}>{label}</span>
                <span style={{ color, fontSize:"12.5px", fontWeight:700, flexShrink:0 }}>
                  {count}
                  {secondaryKey != null && (
                    <span style={{ color: C.textDim, fontWeight:400, marginLeft:"6px" }}>
                      ({secondaryLabel}: {String(item[secondaryKey] ?? "—")})
                    </span>
                  )}
                </span>
              </div>
              <div style={{ height:"3px", background:"rgba(255,255,255,0.04)", borderRadius:"2px" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:"2px", transition:"width 0.3s" }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Filtros ──────────────────────────────────────────────────────────────────

interface Filtros {
  desde: string;
  hasta: string;
  pais: string;
  dispositivo: string;
  fuente: string;
}

const FILTROS_INIT: Filtros = { desde:"", hasta:"", pais:"", dispositivo:"", fuente:"" };
const DISPOSITIVOS = ["📱 Mobile", "🖥️ Desktop", "📟 Tablet"];

function toISO(d: Date) { return d.toISOString().slice(0, 10); }

const PRESETS = [
  { label: "Hoy",      get: () => { const d = toISO(new Date()); return { desde: d, hasta: d }; } },
  { label: "7 días",   get: () => { const h = new Date(); const d = new Date(h); d.setDate(d.getDate() - 6); return { desde: toISO(d), hasta: toISO(h) }; } },
  { label: "30 días",  get: () => { const h = new Date(); const d = new Date(h); d.setDate(d.getDate() - 29); return { desde: toISO(d), hasta: toISO(h) }; } },
  { label: "Este mes", get: () => { const h = new Date(); return { desde: toISO(new Date(h.getFullYear(), h.getMonth(), 1)), hasta: toISO(h) }; } },
];

function FiltrosBar({ filtros, onChange, paises }: { filtros: Filtros; onChange: (f: Filtros) => void; paises: string[] }) {
  const [localFuente, setLocalFuente] = useState(filtros.fuente);
  const latestFiltros = useRef(filtros);
  useEffect(() => { latestFiltros.current = filtros; });
  useEffect(() => { setLocalFuente(filtros.fuente); }, [filtros.fuente]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (localFuente !== latestFiltros.current.fuente)
        onChange({ ...latestFiltros.current, fuente: localFuente });
    }, 400);
    return () => clearTimeout(t);
  }, [localFuente]);

  const inputStyle: React.CSSProperties = {
    background: C.bgSubtle, border:`1px solid ${C.border}`, color: C.text,
    borderRadius:"10px", padding:"9px 12px", fontSize:"13px", fontFamily: FONT_BODY,
    outline:"none",
  };
  const labelStyle: React.CSSProperties = {
    color: C.textDim, fontSize:"10.5px", fontWeight:700, textTransform:"uppercase",
    letterSpacing:"0.1em", marginBottom:"5px", display:"block", fontFamily: FONT_HEAD,
  };
  const hayFiltros = filtros.desde || filtros.hasta || filtros.pais || filtros.dispositivo || filtros.fuente;

  function activePreset() {
    return PRESETS.find((p) => { const r = p.get(); return r.desde === filtros.desde && r.hasta === filtros.hasta; })?.label;
  }

  return (
    <div style={{ background: C.bgCard, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"18px 20px", marginBottom:"16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px", flexWrap:"wrap", gap:"8px" }}>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {PRESETS.map((p) => {
            const active = activePreset() === p.label;
            return (
              <button key={p.label} onClick={() => onChange({ ...filtros, ...p.get() })}
                style={{
                  background: active ? C.accent : C.accentSoft,
                  color: active ? "#000" : C.accent,
                  border: active ? "none" : `1px solid ${C.borderHi}`,
                  borderRadius:"8px", padding:"6px 14px", fontSize:"12px", fontWeight:700,
                  cursor:"pointer", fontFamily: FONT_HEAD, textTransform:"uppercase", letterSpacing:"0.05em",
                }}>
                {p.label}
              </button>
            );
          })}
        </div>
        {hayFiltros && (
          <button onClick={() => { onChange(FILTROS_INIT); setLocalFuente(""); }}
            style={{ background:"none", border:"none", color: C.danger, fontSize:"12px", cursor:"pointer", fontWeight:600 }}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:"14px" }}>
        <div>
          <label style={labelStyle}>Desde</label>
          <input type="date" value={filtros.desde}
            onChange={(e) => onChange({ ...filtros, desde: e.target.value })}
            style={{ ...inputStyle, colorScheme:"dark" }} />
        </div>
        <div>
          <label style={labelStyle}>Hasta</label>
          <input type="date" value={filtros.hasta}
            onChange={(e) => onChange({ ...filtros, hasta: e.target.value })}
            style={{ ...inputStyle, colorScheme:"dark" }} />
        </div>
        <div>
          <label style={labelStyle}>Dispositivo</label>
          <select value={filtros.dispositivo}
            onChange={(e) => onChange({ ...filtros, dispositivo: e.target.value })}
            style={{ ...inputStyle, cursor:"pointer" }}>
            <option value="">Todos</option>
            {DISPOSITIVOS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>País</label>
          <select value={filtros.pais}
            onChange={(e) => onChange({ ...latestFiltros.current, pais: e.target.value })}
            style={{ ...inputStyle, cursor:"pointer", minWidth:"130px" }}>
            <option value="">Todos</option>
            {paises.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Fuente UTM</label>
          <input type="text" placeholder="facebook…" value={localFuente}
            onChange={(e) => setLocalFuente(e.target.value)}
            style={{ ...inputStyle, width:"120px" }} />
        </div>
      </div>
    </div>
  );
}

function buildQuery(base: string, slug: string, filtros: Filtros) {
  const p = new URLSearchParams({ slug });
  if (filtros.desde)       p.set("desde", filtros.desde);
  if (filtros.hasta)       p.set("hasta", filtros.hasta);
  if (filtros.pais)        p.set("pais", filtros.pais);
  if (filtros.dispositivo) p.set("dispositivo", filtros.dispositivo);
  if (filtros.fuente)      p.set("fuente", filtros.fuente);
  return `${base}?${p.toString()}`;
}

function buildAnalyticsQuery(filtros: Filtros) {
  const p = new URLSearchParams();
  if (filtros.desde)       p.set("desde", filtros.desde);
  if (filtros.hasta)       p.set("hasta", filtros.hasta);
  if (filtros.pais)        p.set("pais", filtros.pais);
  if (filtros.fuente)      p.set("source", filtros.fuente);
  if (filtros.dispositivo) {
    // Mapeamos el valor del dropdown a lo que guarda el tracker (mobile/desktop/tablet).
    const d = filtros.dispositivo.toLowerCase();
    if (d.includes("mobile"))  p.set("device", "mobile");
    if (d.includes("desktop")) p.set("device", "desktop");
    if (d.includes("tablet"))  p.set("device", "tablet");
  }
  return `/api/analytics?${p.toString()}`;
}

// ─── Secciones ────────────────────────────────────────────────────────────────

function SeccionMetricas({ slug, filtros }: { slug: string; filtros: Filtros }) {
  const [data, setData]       = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch(buildQuery("/api/metricas", slug, filtros))
      .then((r) => r.json())
      .then((d) => {
        if (d?.totalSesiones !== undefined) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, filtros]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"22px" }}>
      {loading ? (
        <p style={{ color: C.textMuted }}>Cargando métricas...</p>
      ) : !data ? (
        <p style={{ color: C.danger }}>Error al cargar</p>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"14px" }}>
            <StatCard label="Visitantes únicos"  value={data.totalSesiones} />
            <StatCard label="Registros"          value={data.totalRegistros} accent={C.gold} />
            <StatCard label="Tasa conversión"    value={`${data.tasaConversion}%`} accent={C.indigo} />
          </div>

          {data.totalSesiones === 0 ? (
            <div style={{ background: C.accentSoft, border:`1px solid ${C.borderHi}`, borderRadius:"14px", padding:"28px", textAlign:"center" }}>
              <p style={{ color: C.textMuted }}>No hay visitas para los filtros aplicados.</p>
            </div>
          ) : (
            <>
              {data.utmSources.length > 0 && (
                <div>
                  <SectionTitle>Fuentes de tráfico</SectionTitle>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"14px" }}>
                    <BreakdownList items={data.utmSources} label="UTM Source" />
                  </div>
                </div>
              )}
              <AudienciaPanel data={data.visitantes} title="Audiencia general" color={C.accent} />
              {data.totalRegistros > 0 && (
                <AudienciaPanel data={data.registrados} title="Audiencia registrada" color={C.gold} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function SeccionEngagement({ filtros }: { filtros: Filtros }) {
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError("");
    fetch(buildAnalyticsQuery(filtros))
      .then((r) => r.json())
      .then((d) => {
        if (d?.error) { setError(d.error); setLoading(false); return; }
        setData(d);
        setLoading(false);
      })
      .catch((e) => { setError(String(e)); setLoading(false); });
  }, [filtros]);

  if (loading) return <p style={{ color: C.textMuted }}>Cargando engagement...</p>;
  if (error)   return <p style={{ color: C.danger }}>Error: {error}</p>;
  if (!data)   return null;

  const noData = data.totals.sessions === 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:"14px" }}>
        <StatCard label="Sesiones"         value={data.totals.sessions} />
        <StatCard label="Conversiones"     value={data.totals.conversions} accent={C.gold} />
        <StatCard label="Tasa conversión"  value={`${data.totals.conversion_rate}%`} accent={C.indigo} />
        <StatCard label="Tiempo promedio"  value={fmtSec(data.totals.avg_time_s)} />
        <StatCard label="Scroll promedio"  value={`${data.totals.avg_scroll_pct}%`} accent={C.gold} />
        <StatCard label="Clicks promedio"  value={data.totals.avg_clicks.toFixed(1)} accent={C.indigo} />
      </div>

      {/* Micro conversiones */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"14px" }}>
        <StatCard label="Llegaron a 50% scroll" value={`${data.totals.scroll50_rate}%`} hint="% del total de sesiones" />
        <StatCard label="Sobre 60s en sitio"    value={`${data.totals.time60s_rate}%`} hint="% del total de sesiones" accent={C.gold} />
        <StatCard label="Enfocaron el form"     value={`${data.totals.form_focus_rate}%`} hint="% del total de sesiones" accent={C.indigo} />
      </div>

      {noData ? (
        <div style={{ background: C.accentSoft, border:`1px solid ${C.borderHi}`, borderRadius:"14px", padding:"28px", textAlign:"center" }}>
          <p style={{ color: C.textMuted }}>Aún no hay sesiones rastreadas con el tracker granular. En cuanto lleguen visitas nuevas verás la data completa aquí.</p>
        </div>
      ) : (
        <>
          <FunnelChart steps={data.funnel} />

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"14px" }}>
            <BarList
              title="Secciones más vistas"
              items={data.sectionEngagement as unknown as Array<Record<string, string | number>>}
              labelKey="section"
              countKey="sessions_viewed"
              secondaryKey="avg_dwell_s"
              secondaryLabel="avg"
              color={C.accent}
            />
            <BarList
              title="Top CTAs / clicks"
              items={data.topClicks as unknown as Array<Record<string, string | number>>}
              labelKey="target"
              countKey="clicks"
              secondaryKey="unique_sessions"
              secondaryLabel="únicos"
              color={C.gold}
            />
          </div>

          <div>
            <SectionTitle>Segmentación completa</SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"14px" }}>
              <BreakdownList items={data.segments.device}       label="Dispositivo" />
              <BreakdownList items={data.segments.os}           label="Sistema operativo" />
              <BreakdownList items={data.segments.browser}      label="Navegador" />
              <BreakdownList items={data.segments.country}      label="País" />
              <BreakdownList items={data.segments.city}         label="Ciudad" />
              <BreakdownList items={data.segments.utm_source}   label="UTM Source"   color={C.gold} />
              <BreakdownList items={data.segments.utm_medium}   label="UTM Medium"   color={C.gold} />
              <BreakdownList items={data.segments.utm_campaign} label="UTM Campaign" color={C.gold} />
              <BreakdownList items={data.segments.referrer}     label="Referrer"     color={C.indigo} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SeccionLeads({ slug, filtros }: { slug: string; filtros: Filtros }) {
  const [leads, setLeads]     = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setLeads([]);
    fetch(buildQuery("/api/leads", slug, filtros))
      .then((r) => r.json())
      .then((d) => { setLeads(Array.isArray(d) ? d : []); setLoading(false); });
  }, [slug, filtros]);

  const filtered = leads.filter((l) =>
    (l.nombre ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (l.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (l.telefono ?? "").includes(search)
  );

  function exportCsv() {
    const header = "Nombre,Email,Teléfono,Fuente,Medio,Campaña,País,Ciudad,Fecha";
    const rows = filtered.map((l) =>
      [l.nombre, l.email, l.telefono, l.utm_source, l.utm_medium, l.utm_campaign, l.ip_country, l.ip_city, fmt(l.created_at)]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `leads-${slug}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
        <input
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex:1, minWidth:"220px", background: C.bgCard, border:`1px solid ${C.border}`, color: C.text,
            borderRadius:"12px", padding:"13px 18px", fontSize:"15px", outline:"none",
            fontFamily: FONT_BODY,
          }}
        />
        <button onClick={exportCsv}
          style={{
            background: C.accentMid, border:`1px solid ${C.borderHi}`, color: C.accent,
            borderRadius:"12px", padding:"13px 22px", fontSize:"14px", fontWeight:700, cursor:"pointer",
            fontFamily: FONT_HEAD, textTransform:"uppercase", letterSpacing:"0.05em",
          }}>
          Exportar CSV
        </button>
      </div>

      {loading ? (
        <p style={{ color: C.textMuted }}>Cargando leads...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: C.textMuted }}>No hay leads aún.</p>
      ) : (
        <div style={{ overflowX:"auto", background: C.bgCard, border:`1px solid ${C.border}`, borderRadius:"14px" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13.5px" }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {["","Nombre","Email","Teléfono","Fuente","País","Ciudad","Fecha"].map((h) => (
                  <th key={h} style={{
                    color: C.textDim, fontWeight:700, padding:"14px 14px", textAlign:"left", whiteSpace:"nowrap",
                    fontFamily: FONT_HEAD, fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.1em",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const isOpen = expandedId === l.id;
                const ua = parseUA(l.user_agent ?? "");
                return (
                  <>
                    <tr key={l.id}
                      style={{
                        borderBottom: isOpen ? "none" : `1px solid ${C.border}`,
                        background: isOpen ? C.accentSoft : "transparent",
                      }}
                      onMouseEnter={(e) => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                      onMouseLeave={(e) => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <td style={{ padding:"11px 8px 11px 14px" }}>
                        <button
                          onClick={() => setExpandedId(isOpen ? null : l.id)}
                          style={{
                            background: isOpen ? C.accentMid : "rgba(255,255,255,0.05)",
                            border:`1px solid ${isOpen ? C.borderHi : C.border}`,
                            borderRadius:"6px", width:"24px", height:"24px",
                            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                            color: isOpen ? C.accent : C.textMuted, flexShrink:0,
                          }}>
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition:"transform 0.2s" }}>
                            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </td>
                      <td style={{ color: C.text, padding:"11px 14px", fontWeight:600 }}>{l.nombre}</td>
                      <td style={{ color: C.text, padding:"11px 14px" }}>{l.email}</td>
                      <td style={{ color: C.text, padding:"11px 14px" }}>{l.telefono}</td>
                      <td style={{ color: C.textMuted, padding:"11px 14px" }}>{l.utm_source || "—"}</td>
                      <td style={{ color: C.textMuted, padding:"11px 14px" }}>{l.ip_country || "—"}</td>
                      <td style={{ color: C.textMuted, padding:"11px 14px" }}>{l.ip_city || "—"}</td>
                      <td style={{ color: C.textMuted, padding:"11px 14px", whiteSpace:"nowrap" }}>{fmt(l.created_at)}</td>
                    </tr>
                    {isOpen && (
                      <tr key={`${l.id}-detail`} style={{ borderBottom:`1px solid ${C.border}`, background: C.accentSoft }}>
                        <td colSpan={8} style={{ padding:"0 14px 16px 42px" }}>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 28px" }}>
                            {[
                              { label:"Dispositivo", value: ua.tipo },
                              { label:"OS",          value: ua.osDetail },
                              { label:"Navegador",   value: ua.browser },
                              { label:"UTM Medium",  value: l.utm_medium  || "—" },
                              { label:"UTM Campaign",value: l.utm_campaign || "—" },
                            ].map(({ label, value }) => (
                              <span key={label} style={{ fontSize:"13px" }}>
                                <span style={{ color: C.textDim }}>{label}: </span>
                                <span style={{ color: C.text }}>{value}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p style={{ color: C.textDim, fontSize:"12.5px" }}>{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}

function SeccionConfiguracion({ funnels }: { funnels: Funnel[]; onRefresh: () => Promise<void> }) {
  const [localFunnels, setLocalFunnels] = useState<Funnel[]>(funnels);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved,  setSaved]  = useState<string | null>(null);

  useEffect(() => { setLocalFunnels(funnels); }, [funnels]);

  async function handleSave(funnel: Funnel) {
    setSaving(funnel.slug);
    await fetch(`/api/funnels/${funnel.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fb_pixel_id: funnel.fb_pixel_id, fb_event_name: funnel.fb_event_name, ghl_webhook: funnel.ghl_webhook }),
    });
    setSaving(null);
    setSaved(funnel.slug);
    setTimeout(() => setSaved(null), 2000);
  }

  function update(slug: string, key: keyof Funnel, value: string) {
    setLocalFunnels((prev) => prev.map((f) => f.slug === slug ? { ...f, [key]: value } : f));
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      {localFunnels.map((f) => (
        <div key={f.slug} style={{ background: C.bgCard, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"26px" }}>
          <h3 style={{ color: C.text, fontWeight:800, fontSize:"1.15rem", fontFamily: FONT_HEAD, letterSpacing:"-0.01em", margin:0 }}>{f.nombre}</h3>
          <p style={{ color: C.textDim, fontSize:"12px", marginTop:"4px", marginBottom:"22px", fontFamily:"monospace" }}>slug: {f.slug}</p>

          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            <div>
              <label style={{ color: C.textMuted, fontSize:"11px", fontWeight:700, display:"block", marginBottom:"7px", textTransform:"uppercase", letterSpacing:"0.1em", fontFamily: FONT_HEAD }}>
                Facebook Pixel ID
              </label>
              <input
                value={f.fb_pixel_id}
                onChange={(e) => update(f.slug, "fb_pixel_id", e.target.value)}
                placeholder="123456789012345"
                style={{ width:"100%", background: C.bgSubtle, border:`1px solid ${C.border}`, color: C.text,
                  borderRadius:"10px", padding:"12px 14px", fontSize:"15px", boxSizing:"border-box", outline:"none", fontFamily: FONT_BODY }}
              />
            </div>
            <div>
              <label style={{ color: C.textMuted, fontSize:"11px", fontWeight:700, display:"block", marginBottom:"7px", textTransform:"uppercase", letterSpacing:"0.1em", fontFamily: FONT_HEAD }}>
                Evento de conversión Meta
              </label>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {FB_EVENTS.map((ev) => (
                  <button key={ev} type="button"
                    onClick={() => update(f.slug, "fb_event_name", ev)}
                    style={{
                      padding:"8px 14px", borderRadius:"8px", fontSize:"13px", fontWeight:700, cursor:"pointer",
                      background: f.fb_event_name === ev ? C.accent : C.accentSoft,
                      color:      f.fb_event_name === ev ? "#000"     : C.accent,
                      border:     f.fb_event_name === ev ? "none"     : `1px solid ${C.borderHi}`,
                      fontFamily: FONT_HEAD, textTransform:"uppercase", letterSpacing:"0.05em",
                    }}>
                    {ev}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: C.textMuted, fontSize:"11px", fontWeight:700, display:"block", marginBottom:"7px", textTransform:"uppercase", letterSpacing:"0.1em", fontFamily: FONT_HEAD }}>
                GoHighLevel Webhook URL
              </label>
              <input
                value={f.ghl_webhook}
                onChange={(e) => update(f.slug, "ghl_webhook", e.target.value)}
                placeholder="https://services.leadconnectorhq.com/hooks/..."
                style={{ width:"100%", background: C.bgSubtle, border:`1px solid ${C.border}`, color: C.text,
                  borderRadius:"10px", padding:"12px 14px", fontSize:"15px", boxSizing:"border-box", outline:"none", fontFamily: FONT_BODY }}
              />
            </div>
            <button
              onClick={() => handleSave(f)}
              disabled={saving === f.slug}
              style={{
                alignSelf:"flex-start",
                background: saved === f.slug ? C.accentMid : C.accent,
                color:      saved === f.slug ? C.accent    : "#000",
                border:     saved === f.slug ? `1px solid ${C.accent}` : "none",
                borderRadius:"10px", padding:"12px 26px", fontSize:"14px", fontWeight:800, cursor:"pointer",
                fontFamily: FONT_HEAD, textTransform:"uppercase", letterSpacing:"0.05em",
              }}>
              {saving === f.slug ? "Guardando..." : saved === f.slug ? "✓ Guardado" : "Guardar cambios"}
            </button>
          </div>
        </div>
      ))}
      {localFunnels.length === 0 && (
        <p style={{ color: C.textMuted }}>No hay funnels configurados aún.</p>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

// ─── Speaker types ────────────────────────────────────────────────────────────

interface SpeakerRow {
  id:        string;
  name:      string;
  role:      string | null;
  title:     string;
  topic:     string;
  pillar:    string | null;
  ig:        string | null;
  photo_url: string | null;
  featured:  boolean;
  order:     number;
  active:    boolean;
}

const PILLAR_OPTIONS = ["", "Mentalidad", "Velocidad", "Entorno"];
const ROLE_OPTIONS   = ["", "Host", "Co-host"];

function SpeakerForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Partial<SpeakerRow>;
  onSave: (data: Partial<SpeakerRow>, file?: File) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<SpeakerRow>>(initial ?? { featured: false, order: 0, active: true });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initial?.photo_url ?? "");

  function set(key: keyof SpeakerRow, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(String(ev.target?.result ?? ""));
    reader.readAsDataURL(f);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: C.bgSubtle, border: `1px solid ${C.border}`,
    color: C.text, borderRadius: "10px", padding: "11px 14px", fontSize: "14px",
    boxSizing: "border-box", outline: "none", fontFamily: FONT_BODY,
  };
  const labelStyle: React.CSSProperties = {
    color: C.textDim, fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.1em", marginBottom: "5px", display: "block", fontFamily: FONT_HEAD,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Foto */}
      <div>
        <label style={labelStyle}>Foto del speaker</label>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {preview ? (
            <img src={preview} alt="preview" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.accent}` }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.bgSubtle, border: `2px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, fontSize: "24px" }}>?</div>
          )}
          <label style={{ cursor: "pointer", background: C.accentSoft, border: `1px solid ${C.borderHi}`, color: C.accent, borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 700, fontFamily: FONT_HEAD }}>
            Subir imagen
            <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Nombre *</label>
          <input style={inputStyle} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Jorge Serratos" />
        </div>
        <div>
          <label style={labelStyle}>Rol</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.role ?? ""} onChange={(e) => set("role", e.target.value || null)}>
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r || "— Sin rol —"}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Bio corta (quién es) *</label>
        <input style={inputStyle} value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="Fundador Sinergéticos · Autor Best Seller" />
      </div>

      <div>
        <label style={labelStyle}>Tema en el Bootcamp *</label>
        <input style={inputStyle} value={form.topic ?? ""} onChange={(e) => set("topic", e.target.value)} placeholder="Cómo construir un movimiento, no solo un negocio" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Pilar</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.pillar ?? ""} onChange={(e) => set("pillar", e.target.value || null)}>
            {PILLAR_OPTIONS.map((p) => <option key={p} value={p}>{p || "— Sin pilar —"}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Instagram (sin @)</label>
          <input style={inputStyle} value={form.ig ?? ""} onChange={(e) => set("ig", e.target.value || null)} placeholder="jorgeserratos" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Orden</label>
          <input type="number" style={inputStyle} value={form.order ?? 0} onChange={(e) => set("order", Number(e.target.value))} min={0} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", paddingBottom: "2px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.featured ?? false} onChange={(e) => set("featured", e.target.checked)} />
            <span style={{ color: C.textMuted, fontSize: "13px" }}>Destacado</span>
          </label>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", paddingBottom: "2px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.active ?? true} onChange={(e) => set("active", e.target.checked)} />
            <span style={{ color: C.textMuted, fontSize: "13px" }}>Activo</span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
        <button
          onClick={() => onSave(form, file ?? undefined)}
          disabled={saving || !form.name || !form.title || !form.topic}
          style={{
            background: C.accent, color: "#000", border: "none",
            borderRadius: "10px", padding: "12px 26px", fontSize: "14px", fontWeight: 800,
            cursor: "pointer", fontFamily: FONT_HEAD, textTransform: "uppercase", letterSpacing: "0.05em",
            opacity: (!form.name || !form.title || !form.topic) ? 0.4 : 1,
          }}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "none", color: C.textMuted, border: `1px solid ${C.border}`,
            borderRadius: "10px", padding: "12px 22px", fontSize: "14px", fontWeight: 700,
            cursor: "pointer", fontFamily: FONT_HEAD,
          }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function SeccionSpeakers() {
  const [speakers, setSpeakers] = useState<SpeakerRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/speakers");
    const d = await r.json();
    setSpeakers(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function uploadPhoto(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/speakers/upload", { method: "POST", body: fd });
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    return d.url as string;
  }

  async function handleCreate(form: Partial<SpeakerRow>, file?: File) {
    setSaving(true);
    try {
      let photo_url = form.photo_url ?? null;
      if (file) photo_url = await uploadPhoto(file);
      await fetch("/api/speakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo_url }),
      });
      setCreating(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(id: string, form: Partial<SpeakerRow>, file?: File) {
    setSaving(true);
    try {
      let photo_url = form.photo_url;
      if (file) photo_url = await uploadPhoto(file);
      await fetch(`/api/speakers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo_url }),
      });
      setEditId(null);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este speaker?")) return;
    await fetch(`/api/speakers/${id}`, { method: "DELETE" });
    await load();
  }

  const pillarColor: Record<string, string> = {
    Mentalidad: C.accent,
    Velocidad:  "#4ade80",
    Entorno:    C.gold,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ color: C.text, fontWeight: 800, fontSize: "1.1rem", fontFamily: FONT_HEAD, letterSpacing: "-0.01em", margin: 0 }}>
            Speakers del Bootcamp
          </h3>
          <p style={{ color: C.textDim, fontSize: "12.5px", margin: "4px 0 0" }}>
            Los speakers aquí reemplazan la lista estática de la landing.
          </p>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            style={{
              background: C.accent, color: "#000", border: "none",
              borderRadius: "10px", padding: "11px 22px", fontSize: "13px", fontWeight: 800,
              cursor: "pointer", fontFamily: FONT_HEAD, textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
            + Agregar speaker
          </button>
        )}
      </div>

      {creating && (
        <div style={{ background: C.bgCard, border: `1px solid ${C.borderHi}`, borderRadius: "14px", padding: "24px" }}>
          <p style={{ color: C.accent, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "18px", fontFamily: FONT_HEAD }}>Nuevo speaker</p>
          <SpeakerForm
            onSave={handleCreate}
            onCancel={() => setCreating(false)}
            saving={saving}
          />
        </div>
      )}

      {loading ? (
        <p style={{ color: C.textMuted }}>Cargando speakers...</p>
      ) : speakers.length === 0 && !creating ? (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "36px", textAlign: "center" }}>
          <p style={{ color: C.textMuted, marginBottom: "14px" }}>No hay speakers en la base de datos.</p>
          <p style={{ color: C.textDim, fontSize: "13px" }}>Mientras esté vacío, la landing muestra los speakers del archivo estático.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {speakers.map((sp) => (
            <div key={sp.id} style={{ background: C.bgCard, border: `1px solid ${editId === sp.id ? C.borderHi : C.border}`, borderRadius: "14px", padding: "20px 22px" }}>
              {editId === sp.id ? (
                <>
                  <p style={{ color: C.accent, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", fontFamily: FONT_HEAD }}>Editando: {sp.name}</p>
                  <SpeakerForm
                    initial={sp}
                    onSave={(form, file) => handleEdit(sp.id, form, file)}
                    onCancel={() => setEditId(null)}
                    saving={saving}
                  />
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {sp.photo_url ? (
                    <img src={sp.photo_url} alt={sp.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.bgSubtle, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted, fontSize: "18px", fontWeight: 700, flexShrink: 0, fontFamily: FONT_HEAD }}>
                      {sp.name.slice(0, 1)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ color: C.text, fontWeight: 700, fontSize: "14px", fontFamily: FONT_HEAD }}>{sp.name}</span>
                      {sp.role && <span style={{ background: C.accentSoft, color: C.accent, border: `1px solid ${C.borderHi}`, borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 700 }}>{sp.role}</span>}
                      {sp.pillar && <span style={{ background: `${pillarColor[sp.pillar] ?? C.accent}18`, color: pillarColor[sp.pillar] ?? C.accent, borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 700 }}>{sp.pillar}</span>}
                      {!sp.active && <span style={{ background: "rgba(239,68,68,0.1)", color: C.danger, borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 700 }}>Inactivo</span>}
                    </div>
                    <p style={{ color: C.textMuted, fontSize: "12.5px", margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sp.title}</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button
                      onClick={() => setEditId(sp.id)}
                      style={{ background: C.accentSoft, border: `1px solid ${C.borderHi}`, color: C.accent, borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: FONT_HEAD }}>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(sp.id)}
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: C.danger, borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: FONT_HEAD }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type Tab = "metricas" | "engagement" | "leads" | "speakers" | "config";

export default function DashboardPage() {
  const [tab, setTab]               = useState<Tab>("metricas");
  const [funnels, setFunnels]       = useState<Funnel[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [filtros, setFiltros]       = useState<Filtros>(FILTROS_INIT);
  const [paises, setPaises]         = useState<string[]>([]);
  const router                      = useRouter();

  const loadFunnels = useCallback(async () => {
    const r = await fetch("/api/funnels");
    const d = await r.json();
    const list: Funnel[] = Array.isArray(d) ? d : [];
    setFunnels(list);
    setSelectedSlug((prev) => {
      if (prev && list.find((f) => f.slug === prev)) return prev;
      return list[0]?.slug ?? "";
    });
  }, []);

  useEffect(() => { loadFunnels(); }, [loadFunnels]);

  useEffect(() => {
    if (!selectedSlug) return;
    const sinPais: Filtros = { ...filtros, pais: "" };
    fetch(buildQuery("/api/metricas", selectedSlug, sinPais))
      .then((r) => r.json())
      .then((d: MetricasData) => {
        const lista = (d.visitantes?.pais ?? [])
          .map((p) => p.label)
          .filter((l) => l && l !== "Desconocido")
          .sort();
        setPaises(lista);
      })
      .catch(() => {});
  }, [selectedSlug, filtros.desde, filtros.hasta, filtros.dispositivo, filtros.fuente]);

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/dashboard/login");
  }

  const selectedFunnel = funnels.find((f) => f.slug === selectedSlug);

  const tabs: { id: Tab; label: string }[] = [
    { id:"metricas",   label:"Métricas" },
    { id:"engagement", label:"Engagement" },
    { id:"leads",      label:"Leads" },
    { id:"speakers",   label:"Speakers" },
    { id:"config",     label:"Configuración" },
  ];

  return (
    <div style={{
      minHeight:"100vh", background: C.bg, color: C.text,
      fontFamily: FONT_BODY,
      backgroundImage: "radial-gradient(circle at 10% -10%, rgba(0,224,64,0.05), transparent 40%), radial-gradient(circle at 90% 110%, rgba(212,168,67,0.04), transparent 40%)",
    }}>
      {/* Header */}
      <div style={{
        background:"rgba(0,0,0,0.85)", backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${C.border}`, padding:"16px 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px",
        position:"sticky", top:0, zIndex:10,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px", flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
            <div style={{ width:"10px", height:"10px", borderRadius:"50%", background: C.accent, boxShadow:`0 0 12px ${C.accent}` }}/>
            <span style={{ color: C.text, fontWeight:800, fontSize:"1.05rem", fontFamily: FONT_HEAD, letterSpacing:"-0.01em" }}>
              Synergy Dashboard
            </span>
          </div>
          {funnels.length > 0 && (
            <div style={{ position:"relative", flex:1, maxWidth:"320px", marginLeft:"8px" }}>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                style={{
                  width:"100%", background: C.bgCard, border:`1px solid ${C.border}`, color: C.text,
                  borderRadius:"10px", padding:"9px 32px 9px 14px", fontSize:"13.5px", fontWeight:600,
                  cursor:"pointer", appearance:"none", WebkitAppearance:"none", outline:"none",
                  fontFamily: FONT_BODY,
                }}>
                {funnels.map((f) => (
                  <option key={f.slug} value={f.slug}>{f.nombre}</option>
                ))}
              </select>
              <svg style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}
                width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke={C.textMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {selectedFunnel && (
            <span style={{ color: C.textDim, fontSize:"12px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontFamily:"monospace" }}>
              {selectedFunnel.slug}
            </span>
          )}
        </div>

        <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
          <a href="/ops"
            style={{
              display:"flex", alignItems:"center", gap:"7px",
              background: C.accentSoft, border:`1px solid ${C.borderHi}`, color: C.accent,
              borderRadius:"10px", padding:"9px 16px", fontSize:"12.5px", cursor:"pointer",
              fontFamily: FONT_HEAD, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:700,
              textDecoration:"none",
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Ops
          </a>
          <button onClick={handleLogout}
            style={{
              background:"transparent", border:`1px solid ${C.border}`, color: C.textMuted,
              borderRadius:"10px", padding:"9px 18px", fontSize:"12.5px", cursor:"pointer",
              fontFamily: FONT_HEAD, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:700,
            }}>
            Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", gap:"4px",
        background:"rgba(0,0,0,0.6)", backdropFilter:"blur(14px)",
        position:"sticky", top:"65px", zIndex:9,
      }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background:"none", border:"none",
              borderBottom: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
              color: tab === t.id ? C.accent : C.textMuted,
              padding:"15px 18px", fontSize:"13px",
              fontWeight: tab === t.id ? 800 : 500, cursor:"pointer",
              transition:"all 0.15s", fontFamily: FONT_HEAD,
              textTransform:"uppercase", letterSpacing:"0.08em",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"28px 20px 80px" }}>
        {tab === "speakers" ? (
          <SeccionSpeakers />
        ) : !selectedSlug ? (
          <p style={{ color: C.textMuted }}>Cargando funnels...</p>
        ) : (
          <>
            {tab !== "config" && (
              <FiltrosBar filtros={filtros} onChange={setFiltros} paises={paises} />
            )}
            {tab === "metricas"   && <SeccionMetricas   slug={selectedSlug} filtros={filtros} />}
            {tab === "engagement" && <SeccionEngagement filtros={filtros} />}
            {tab === "leads"      && <SeccionLeads      slug={selectedSlug} filtros={filtros} />}
            {tab === "config"     && <SeccionConfiguracion funnels={funnels} onRefresh={loadFunnels} />}
          </>
        )}
      </div>
    </div>
  );
}
