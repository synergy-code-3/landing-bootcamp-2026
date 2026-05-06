"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { content, type Speaker } from "./content";
import { HeroBg } from "./HeroBg";
import { initTracker, getTracker } from "@/lib/tracker";
import { trackMetaLead } from "@/components/MetaPixel";

// ─── DATA ──────────────────────────────────────────────────
const countries = [
  "México","Colombia","Argentina","Chile","Perú","Venezuela","Ecuador",
  "Guatemala","Bolivia","República Dominicana","Honduras","El Salvador",
  "Costa Rica","Panamá","Uruguay","Paraguay","Nicaragua","Estados Unidos",
  "España","Canadá","Otro",
];

// ─── ICONS ─────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const CheckCircle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const Lock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IgIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── DETAIL ICONS ───────────────────────────────────────────
const detailIcons = [
  <svg key="cal" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  <svg key="ppl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="aw"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  <svg key="vid" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
];

// ─── TRACKER HOOK (diferido post-LCP) ──────────────────────
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};
function useTracker() {
  useEffect(() => {
    const w = window as IdleWindow;
    const start = () => initTracker();
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(start, { timeout: 3000 });
    } else {
      w.setTimeout(start, 1800);
    }
  }, []);
}

// ─── COUNTDOWN HOOK ────────────────────────────────────────
function useCountdown(isoTarget: string) {
  const target = useMemo(() => new Date(isoTarget).getTime(), [isoTarget]);
  const [diff, setDiff] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setDiff(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    done: diff === 0,
  };
}

// ─── SCROLL REVEAL HOOK ────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── WHAT IS A BOOTCAMP SECTION ────────────────────────────
function WhatIsBootcamp() {
  return (
    <section className="whatis section" data-section="whatis">
      <div className="whatis-bg" aria-hidden="true" />
      <div className="container">
        <div className="whatis-header">
          <span className="whatis-live-badge reveal">{content.whatIs.live_badge}</span>
          <span className="section-label reveal reveal-delay-1">{content.whatIs.label}</span>
          <h2 className="section-title reveal reveal-delay-2">
            {content.whatIs.title_1} <span className="text-red whatis-strike">{content.whatIs.title_em}</span> {content.whatIs.title_2}
          </h2>
          <p className="whatis-intro reveal reveal-delay-3">{content.whatIs.intro}</p>
        </div>

        <div className="whatis-split">
          <div className="whatis-col whatis-col-no reveal">
            <div className="whatis-col-head whatis-no">
              <span className="whatis-col-mark">✕</span>
              <div>
                <div className="whatis-col-eyebrow">01 · Frena</div>
                <div className="whatis-col-label">{content.whatIs.notHeader}</div>
              </div>
            </div>
            <ul className="whatis-list">
              {content.whatIs.notItems.map((it, i) => (
                <li key={it.t} className="whatis-item whatis-item-no" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                  <span className="whatis-item-strike"></span>
                  <div>
                    <div className="whatis-item-title">{it.t}</div>
                    <div className="whatis-item-body">{it.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="whatis-bridge" aria-hidden="true">
            <div className="whatis-bridge-line"></div>
            <div className="whatis-bridge-label">{content.whatIs.bridge}</div>
            <div className="whatis-bridge-arrow">→</div>
          </div>

          <div className="whatis-col whatis-col-yes reveal reveal-delay-2">
            <div className="whatis-col-head whatis-yes">
              <span className="whatis-col-mark">✓</span>
              <div>
                <div className="whatis-col-eyebrow">02 · Transforma</div>
                <div className="whatis-col-label">{content.whatIs.isHeader}</div>
              </div>
            </div>
            <ul className="whatis-list">
              {content.whatIs.isItems.map((it, i) => (
                <li key={it.t} className="whatis-item whatis-item-yes" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>
                  <span className="whatis-item-check"><CheckCircle /></span>
                  <div>
                    <div className="whatis-item-title">{it.t}</div>
                    <div className="whatis-item-body">{it.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="whatis-closing reveal reveal-delay-3">
          <p className="whatis-closing-headline">
            {content.whatIs.closing_1} <span className="text-red">{content.whatIs.closing_em}</span> {content.whatIs.closing_2}
          </p>
          <p className="whatis-closing-foot">{content.whatIs.closing_foot}</p>
        </div>
        <div className="section-cta reveal">
          <a href="#registro" className="btn-primary" data-track="whatis_cta">
            Reservar mi acceso gratuito <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── 3D PILLARS ANIMATION ──────────────────────────────────
function PillarsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<HTMLDivElement>(null);
  const pillarsCount = content.pillars.items.length;
  const [visible, setVisible] = useState<boolean[]>(() => Array(pillarsCount).fill(false));
  const [synthVisible, setSynthVisible] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cards = stage.querySelectorAll<HTMLElement>(".pillar-card");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute("data-idx"));
          if (entry.isIntersecting && Number.isFinite(idx)) {
            setVisible((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );
    cards.forEach((c) => obs.observe(c));

    const synthEl = synthRef.current;
    let synthObs: IntersectionObserver | null = null;
    if (synthEl) {
      synthObs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setSynthVisible(true); }),
        { threshold: 0.4 }
      );
      synthObs.observe(synthEl);
    }

    return () => { obs.disconnect(); synthObs?.disconnect(); };
  }, []);

  const pillars = content.pillars.items;
  const doneCount = visible.filter(Boolean).length;

  return (
    <section className="pillars section" data-section="pillars">
      <div className="pillars-bg" aria-hidden="true">
        <div className="pillars-bg-glow" />
        <div className="pillars-bg-grid" />
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="pillars-particle" style={{ left: `${(i * 43) % 100}%`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      <div className="container pillars-inner">
        <div className="pillars-header">
          <span className="section-label reveal">{content.pillars.label}</span>
          <h2 className="section-title reveal reveal-delay-1">
            {content.pillars.title_1} <span className="text-red">{content.pillars.title_em}</span>
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 620, margin: "0 auto" }}>
            {content.pillars.subtitle}
          </p>
        </div>

        <div className="pillars-stage" ref={stageRef}>
          <div className="pillars-acelerar-intro" aria-hidden="true">
            <div className="pillars-acelerar-line" />
            <span className="pillars-acelerar-word">Acelerar</span>
            <div className="pillars-acelerar-line" />
          </div>

          <div className="pillars-scene">
            {pillars.map((p, i) => {
              const isOn = visible[i];
              return (
                <div
                  key={p.n}
                  data-idx={i}
                  className={`pillar-card ${isOn ? "visible" : ""}`}
                  style={{ "--pillar-color": p.color, "--pillar-delay": `${i * 0.12}s` } as React.CSSProperties}
                >
                  <div className="pillar-card-glow" />
                  <div className="pillar-num">{p.n}</div>
                  <div className="pillar-tag">{p.tag}</div>
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-headline">{p.headline}</p>
                  <p className="pillar-body">{p.body}</p>
                  <ul className="pillar-bullets">
                    {p.bullets.map((b) => (
                      <li key={b}><span className="pillar-check"><CheckCircle /></span>{b}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`pillars-synthesis ${synthVisible ? "visible" : ""}`} ref={synthRef}>
          <div className="pillars-synthesis-bar">
            {pillars.map((p) => (
              <span key={p.n} className="pillars-synthesis-chip" style={{ background: p.color }}>{p.tag}</span>
            ))}
          </div>
          <div className="pillars-synthesis-equation">
            <span>{content.pillars.synthesis.title}</span>
            <strong className="pillars-synthesis-result">{content.pillars.synthesis.result}</strong>
          </div>
          <p className="pillars-synthesis-caption">{content.pillars.synthesis.caption}</p>
        </div>
      </div>
    </section>
  );
}

// ─── RULETA SVG ────────────────────────────────────────────
function RouletteWheel({ prizes, highlight }: { prizes: typeof content.prizes.items; highlight: number }) {
  const N = prizes.length * 3; // 9 segmentos (3 premios × 3)
  const cx = 150, cy = 150, R = 128, hub = 26;
  const wheelRef = useRef<SVGGElement>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    const segCenterDeg = (highlight + 0.5) / N * 360;
    const baseTarget = -segCenterDeg;
    let target = baseTarget;
    while (target <= angleRef.current + 360) target += 360;
    angleRef.current = target;
    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)";
      wheelRef.current.style.transform = `rotate(${target}deg)`;
      wheelRef.current.style.transformOrigin = `${cx}px ${cy}px`;
    }
  }, [highlight, N]);

  const segColors = [
    { bg: "#111", line: "rgba(251,191,36,0.3)" },
    { bg: "#0c0c0c", line: "rgba(0,224,64,0.2)" },
  ];

  const segments = Array.from({ length: N }, (_, i) => {
    const prize = prizes[i % prizes.length];
    const a1 = (i / N * 360 - 90) * Math.PI / 180;
    const a2 = ((i + 1) / N * 360 - 90) * Math.PI / 180;
    const x1o = cx + R * Math.cos(a1), y1o = cy + R * Math.sin(a1);
    const x2o = cx + R * Math.cos(a2), y2o = cy + R * Math.sin(a2);
    const x1i = cx + hub * Math.cos(a1), y1i = cy + hub * Math.sin(a1);
    const x2i = cx + hub * Math.cos(a2), y2i = cy + hub * Math.sin(a2);
    const d = `M${x1o.toFixed(2)} ${y1o.toFixed(2)} A${R} ${R} 0 0 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)} L${x2i.toFixed(2)} ${y2i.toFixed(2)} A${hub} ${hub} 0 0 0 ${x1i.toFixed(2)} ${y1i.toFixed(2)}Z`;
    const midA = ((i + 0.5) / N * 360 - 90) * Math.PI / 180;
    const lr = (R + hub) / 2;
    const lx = cx + lr * Math.cos(midA);
    const ly = cy + lr * Math.sin(midA);
    const textRot = (i + 0.5) / N * 360;
    const isActive = (i % prizes.length) === highlight;
    const col = segColors[i % 2];
    return { d, lx, ly, textRot, prize, isActive, col };
  });

  return (
    <div className="ruleta-wrap">
      <svg viewBox="0 0 300 300" className="ruleta-svg" aria-hidden="true">
        {/* Anillos decorativos externos */}
        <circle cx={cx} cy={cy} r={R + 14} fill="none" stroke="rgba(251,191,36,0.15)" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={R + 8}  fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="1" strokeDasharray="4 6" />

        <g ref={wheelRef}>
          {segments.map((seg, i) => (
            <g key={i}>
              <path
                d={seg.d}
                fill={seg.isActive ? "rgba(0,224,64,0.18)" : seg.col.bg}
                stroke={seg.isActive ? "rgba(0,224,64,0.5)" : seg.col.line}
                strokeWidth="1.5"
              />
              <text
                x={seg.lx} y={seg.ly}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="16"
                transform={`rotate(${seg.textRot},${seg.lx},${seg.ly})`}
              >{seg.prize.icon}</text>
            </g>
          ))}
          {/* Hub central */}
          <circle cx={cx} cy={cy} r={hub}     fill="#0a0a0a" stroke="rgba(251,191,36,0.5)" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={hub - 7} fill="#111" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="900" fill="rgba(251,191,36,0.8)">$</text>
        </g>


        {/* Puntero fijo en la parte superior */}
        <polygon
          points={`${cx - 9},${cy - R - 10} ${cx + 9},${cy - R - 10} ${cx},${cy - R + 6}`}
          fill="#fbbf24" stroke="#78350f" strokeWidth="1.5"
        />
        <circle cx={cx} cy={cy - R - 10} r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── PRIZES · SECCIÓN ──────────────────────────────────────
function PrizesRoulette() {
  const prizes = content.prizes.items;
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHighlight((h) => (h + 1) % prizes.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [prizes.length]);

  return (
    <section className="prizes section" data-section="prizes">
      <div className="prizes-bg" aria-hidden="true" />
      <div className="container">
        <div className="prizes-header">
          <span className="section-label reveal">{content.prizes.label}</span>
          <h2 className="section-title reveal reveal-delay-1">
            {content.prizes.title_1} <span className="text-gold">{content.prizes.title_em}</span>
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 620, margin: "0 auto" }}>
            {content.prizes.subtitle}
          </p>
        </div>

        <div className="prize-display reveal reveal-delay-2">
          {/* Ruleta */}
          <RouletteWheel prizes={prizes} highlight={highlight} />

          {/* Sorteando ahora */}
          <div className="prize-legend">
            <div className="roulette-legend-eyebrow">Sorteando ahora</div>
            <div key={highlight} className="roulette-legend-card">
              <div className="roulette-legend-icon">{prizes[highlight].icon}</div>
              <div>
                <div className="roulette-legend-title">{prizes[highlight].title}</div>
                <div className="roulette-legend-body">{prizes[highlight].body}</div>
              </div>
            </div>
            <ul className="roulette-legend-list">
              {prizes.map((p, i) => (
                <li key={i} className={highlight === i ? "is-on" : ""}>
                  <span className="roulette-legend-dot"></span>{p.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="prizes-live-note">
          <span className="prizes-live-pulse" aria-hidden="true"></span>
          Solo para conectados en vivo · Sin grabación, sin repetición
        </div>
        <p className="prizes-foot reveal">{content.prizes.footnote}</p>
      </div>
    </section>
  );
}

// ─── REPLAY GATE (activable el 9 de junio) ─────────────────
function ReplayGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const enabled = new Date(content.replay.enabled_from).getTime();
    if (Number.isNaN(enabled)) return;
    if (Date.now() >= enabled) {
      const dismissed = typeof window !== "undefined" && sessionStorage.getItem("_replay_dismissed");
      if (!dismissed) setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try { sessionStorage.setItem("_replay_dismissed", "1"); } catch { /* noop */ }
    setShow(false);
  };

  return (
    <div className="replay-overlay" role="dialog" aria-modal="true" aria-labelledby="replay-title">
      <div className="replay-backdrop" onClick={dismiss} />
      <div className="replay-modal">
        <button className="replay-close" onClick={dismiss} aria-label="Cerrar">✕</button>
        <div className="replay-eyebrow">Bootcamp 2026 · Post-evento</div>
        <h2 id="replay-title" className="replay-title">{content.replay.popup_title}</h2>
        <p className="replay-body">{content.replay.popup_body}</p>
        <div className="replay-actions">
          <a className="btn-primary" href={content.replay.alt_path}>{content.replay.popup_cta}</a>
          <button type="button" className="btn-ghost" onClick={dismiss}>{content.replay.popup_dismiss}</button>
        </div>
      </div>
    </div>
  );
}

// ─── SOCIAL PROOF POPUP ────────────────────────────────────
function SocialProofPopup() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const initial = window.setTimeout(() => setVisible(true), 8000);
    return () => window.clearTimeout(initial);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || dismissed) return;
    const cycle = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % content.popup.people.length);
        setVisible(true);
      }, 600);
    }, 9000);
    return () => window.clearInterval(cycle);
  }, [visible, dismissed]);

  if (dismissed) return null;
  const person = content.popup.people[idx];

  return (
    <div className={`popup-proof ${visible ? "visible" : ""}`} role="status" aria-live="polite">
      <button className="popup-close" onClick={() => setDismissed(true)} aria-label="Cerrar notificación">
        <CloseIcon />
      </button>
      <div className="popup-avatar">{person.name.slice(0,1)}</div>
      <div className="popup-body">
        <div className="popup-name"><strong>{person.name}</strong> · <span className="popup-city">{person.city}</span></div>
        <div className="popup-action">{content.popup.title_prefix}</div>
        <div className="popup-time">hace {person.minutes} min · <span className="popup-urgency">{content.popup.urgency}</span></div>
      </div>
    </div>
  );
}

// ─── ROI CALCULATOR · TACÓMETRO ─────────────────────────────
function RoiCalculator() {
  const [ticket, setTicket]         = useState(500);
  const [clients, setClients]       = useState(10);
  const [priceLever, setPriceLever] = useState(30);
  const [volumeLever, setVolumeLever] = useState(50);
  const [recurrence, setRecurrence] = useState(1.5);

  const currentMonth   = ticket * clients;
  const newTicket      = ticket * (1 + priceLever / 100);
  const newClients     = clients * (1 + volumeLever / 100);
  const projectedMonth = newTicket * newClients;
  const projectedYear  = projectedMonth * 12 * recurrence;
  const currentYear    = currentMonth * 12;
  const deltaYear      = projectedYear - currentYear;
  const multiplier     = currentYear > 0 ? projectedYear / currentYear : 1;

  // Aguja: 0° = reposo (-120°), 240° de barrido máximo → 5× = tope
  const MAX_MULTI = 5;
  const clamped   = Math.min(MAX_MULTI, Math.max(1, multiplier));
  const needle    = -120 + ((clamped - 1) / (MAX_MULTI - 1)) * 240;

  // Arco de llenado (mismo cálculo para el dash offset)
  const ARC_LEN = 565; // ~ 240° de un círculo r=135
  const fill    = ((clamped - 1) / (MAX_MULTI - 1)) * ARC_LEN;

  const fmt = (n: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.max(0, n));

  function scrollToRegistro() {
    document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" });
    try { getTracker()?.track({ type: "click", target: "calculator_cta" }); } catch { /* noop */ }
  }

  return (
    <section className="calculator section" data-section="calculator">
      <div className="container">
        <div className="calculator-header">
          <span className="section-label reveal">{content.calculator.label}</span>
          <h2 className="section-title reveal reveal-delay-1">
            {content.calculator.title_1} <span className="text-red">{content.calculator.title_em}</span>
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 700, margin: "0 auto" }}>
            {content.calculator.subtitle}
          </p>
        </div>

        <div className="accelerator reveal reveal-delay-2">
          <div className="accelerator-grid">
            {/* ─── Tacómetro central ─── */}
            <div className="tacho-col">
            <div className="tacho">
              <svg className="tacho-svg" viewBox="0 0 320 240" overflow="hidden" aria-hidden="true">
                <defs>
                  <linearGradient id="tacho-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#4ade80" />
                    <stop offset="50%"  stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <radialGradient id="hub-grad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#6b7280" />
                  </radialGradient>
                  <filter id="tacho-glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Track base */}
                <path d="M 35 200 A 135 135 0 1 1 285 200" stroke="rgba(255,255,255,0.06)" strokeWidth="18" fill="none" strokeLinecap="round" />
                {/* Fill */}
                <path
                  d="M 35 200 A 135 135 0 1 1 285 200"
                  stroke="url(#tacho-fill)"
                  strokeWidth="18"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={ARC_LEN}
                  strokeDashoffset={ARC_LEN - fill}
                  style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)", filter: "url(#tacho-glow)" }}
                />
                {/* Ticks */}
                {[1, 1.5, 2, 3, 4, 5].map((m, i) => {
                  const angle = -120 + ((m - 1) / (MAX_MULTI - 1)) * 240;
                  const r1 = 115, r2 = 130;
                  const rad = (angle - 90) * Math.PI / 180;
                  const x1 = 160 + Math.cos(rad) * r1;
                  const y1 = 160 + Math.sin(rad) * r1;
                  const x2 = 160 + Math.cos(rad) * r2;
                  const y2 = 160 + Math.sin(rad) * r2;
                  const lx = 160 + Math.cos(rad) * (r1 - 14);
                  const ly = 160 + Math.sin(rad) * (r1 - 14);
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                      <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.55)">
                        {m}×
                      </text>
                    </g>
                  );
                })}
                {/* Needle — rect with fill-box so transform-origin 50%/100% = pivot at (160,200) */}
                <rect
                  x="158.5" y="124" width="3" height="76" rx="1.5"
                  fill="#ef4444"
                  filter="url(#tacho-glow)"
                  className="tacho-needle-svg"
                  style={{ transform: `rotate(${needle}deg)` }}
                />
                {/* Hub dot */}
                <circle cx="160" cy="200" r="12" fill="url(#hub-grad)" style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.9))' }} />
              </svg>

            </div>
            <div className="tacho-readout">
              <div className="tacho-readout-label">Multiplicador anual</div>
              <div className="tacho-readout-value">{multiplier.toFixed(2)}×</div>
              <div className="tacho-readout-sub">vs tu facturación actual</div>
            </div>
            </div>{/* /tacho-col */}

            {/* ─── Controles tipo cockpit ─── */}
            <div className="cockpit">
              <div className="cockpit-row">
                <div className="cockpit-field">
                  <label className="cockpit-label">{content.calculator.inputs.ticket_label}</label>
                  <div className="cockpit-input-wrap">
                    <span className="cockpit-prefix">$</span>
                    <input type="number" className="cockpit-input" value={ticket} min={10} step={10} onChange={(e) => setTicket(Math.max(0, Number(e.target.value)))} data-track="calc_ticket" />
                    <span className="cockpit-suffix">USD</span>
                  </div>
                </div>
                <div className="cockpit-field">
                  <label className="cockpit-label">{content.calculator.inputs.clients_label}</label>
                  <div className="cockpit-input-wrap">
                    <input type="number" className="cockpit-input" value={clients} min={1} step={1} onChange={(e) => setClients(Math.max(0, Number(e.target.value)))} data-track="calc_clients" />
                    <span className="cockpit-suffix">/mes</span>
                  </div>
                </div>
              </div>

              <div className="throttle">
                <div className="throttle-head">
                  <span className="throttle-num">01</span>
                  <div>
                    <div className="throttle-label">{content.calculator.levers.price_label}</div>
                    <div className="throttle-hint">{content.calculator.levers.price_hint}</div>
                  </div>
                  <div className="throttle-value">+{priceLever}%</div>
                </div>
                <input type="range" min={0} max={150} step={5} value={priceLever} onChange={(e) => setPriceLever(Number(e.target.value))} data-track="calc_price_lever" />
              </div>

              <div className="throttle">
                <div className="throttle-head">
                  <span className="throttle-num">02</span>
                  <div>
                    <div className="throttle-label">{content.calculator.levers.volume_label}</div>
                    <div className="throttle-hint">{content.calculator.levers.volume_hint}</div>
                  </div>
                  <div className="throttle-value">+{volumeLever}%</div>
                </div>
                <input type="range" min={0} max={300} step={10} value={volumeLever} onChange={(e) => setVolumeLever(Number(e.target.value))} data-track="calc_volume_lever" />
              </div>

              <div className="throttle">
                <div className="throttle-head">
                  <span className="throttle-num">03</span>
                  <div>
                    <div className="throttle-label">{content.calculator.levers.recurrence_label}</div>
                    <div className="throttle-hint">{content.calculator.levers.recurrence_hint}</div>
                  </div>
                  <div className="throttle-value">{recurrence.toFixed(1)}×</div>
                </div>
                <input type="range" min={1} max={6} step={0.1} value={recurrence} onChange={(e) => setRecurrence(Number(e.target.value))} data-track="calc_recurrence_lever" />
              </div>
            </div>
          </div>

          {/* Panel de resultados */}
          <div className="dashboard-readout">
            <div className="readout-cell">
              <div className="readout-cell-label">{content.calculator.outputs.current_month}</div>
              <div className="readout-cell-value">{fmt(currentMonth)}</div>
            </div>
            <div className="readout-cell">
              <div className="readout-cell-label">{content.calculator.outputs.projected_month}</div>
              <div className="readout-cell-value text-green">{fmt(projectedMonth)}</div>
            </div>
            <div className="readout-cell readout-cell-primary">
              <div className="readout-cell-label">{content.calculator.outputs.projected_year}</div>
              <div className="readout-cell-value big text-green">{fmt(projectedYear)}</div>
            </div>
            <div className="readout-cell readout-delta">
              <div className="readout-cell-label">{content.calculator.outputs.delta_year}</div>
              <div className="readout-cell-value big">+ {fmt(deltaYear)}</div>
            </div>
          </div>

          <button type="button" className="btn-primary calc-cta" onClick={scrollToRegistro}>
            {content.calculator.outputs.cta} <ArrowRight />
          </button>
          <p className="calc-foot">{content.calculator.footnote}</p>
        </div>
      </div>
    </section>
  );
}

// ─── SPEAKER CARD (magazine portrait) ─────────────────────
function SpeakerCard({ s }: { s: Speaker }) {
  const [photoOk, setPhotoOk] = useState(Boolean(s.photo));

  return (
    <div className={`scm${s.featured ? " scm-featured" : ""}`}>
      {s.photo && photoOk ? (
        <NextImage
          className="scm-photo"
          src={s.photo}
          alt={s.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 960px) 33vw, 200px"
          style={{ objectFit: "cover", objectPosition: "top center" }}
          onError={() => setPhotoOk(false)}
        />
      ) : (
        <div className="scm-fallback" style={{ background: s.bg ?? "linear-gradient(135deg,#1a1a1a,#333)" }}>
          {s.initial ?? s.name.slice(0, 1)}
        </div>
      )}
      <div className="scm-overlay" aria-hidden="true" />
      {s.role && <span className="scm-role">{s.role}</span>}
      <div className="scm-info">
        <div className="scm-name">{s.name}</div>
      </div>
      <div className="scm-hover-panel">
        <div className="scm-hover-name">{s.name}</div>
        {s.title && s.title !== "Próximamente" && (
          <p className="scm-hover-title">{s.title}</p>
        )}
        {s.topic && s.topic !== "Próximamente" && (
          <div className="scm-hover-topic">
            <span className="scm-hover-topic-label">Va a hablar de</span>
            <span className="scm-hover-topic-text">{s.topic}</span>
          </div>
        )}
        {s.ig && (
          <a
            className="scm-hover-ig"
            href={`https://instagram.com/${s.ig}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <IgIcon /> @{s.ig}
          </a>
        )}
      </div>
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────
const WA_LINK = "https://group.wha.link/eg7v9e";

function WhatsAppTakeover({ nombre }: { nombre: string }) {
  const [secs, setSecs] = useState(5);
  const opened = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(t);
          if (!opened.current) { opened.current = true; window.open(WA_LINK, "_blank"); }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="wa-takeover">
      <div className="wa-takeover-inner">
        <div className="wa-confetti" aria-hidden="true">
          {["🎉","✨","🚀","💪","🔥"].map((e, i) => (
            <span key={i} className="wa-confetti-piece" style={{ "--i": i } as React.CSSProperties}>{e}</span>
          ))}
        </div>

        <div className="wa-check">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00e040" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 className="wa-title">
          {nombre ? `¡Listo, ${nombre}!` : "¡Registro exitoso!"}
        </h1>
        <p className="wa-subtitle">Tu lugar en el Bootcamp está confirmado.</p>

        <div className="wa-card">
          <div className="wa-card-top">
            <svg className="wa-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#25D366"/>
              <path d="M23.5 8.5C21.7 6.7 19.4 5.7 17 5.7c-4.9 0-8.8 3.9-8.8 8.8 0 1.6.4 3.1 1.2 4.4L8 24.3l5.5-1.4c1.3.7 2.7 1.1 4.2 1.1h.1c4.9 0 8.8-3.9 8.8-8.8-.1-2.4-1.1-4.6-2.8-6.3zm-6.5 13.5h-.1c-1.3 0-2.6-.4-3.7-1l-.3-.2-2.8.7.7-2.7-.2-.3c-.7-1.1-1.1-2.4-1.1-3.7 0-3.9 3.2-7.1 7.1-7.1 1.9 0 3.7.7 5 2.1s2.1 3.1 2.1 5c0 3.9-3.2 7.2-7 7.2zm3.9-5.3c-.2-.1-1.3-.6-1.4-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0-.2-.1-.9-.3-1.7-1.1-.6-.6-1-1.3-1.1-1.5-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2-.1-.3l-.6-1.5c-.2-.4-.3-.4-.5-.4h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.7 2.6 4.1 3.6.6.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.4-.1 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" fill="white"/>
            </svg>
            <div className="wa-card-label">
              <span className="wa-card-label-main">Grupo de WhatsApp</span>
              <span className="wa-card-label-sub">Bootcamp 2026 · Comunidad oficial</span>
            </div>
          </div>
          <p className="wa-card-body">
            Aquí recibirás el link de acceso al evento, recordatorios y estarás conectado con los demás participantes. <strong>Sin esto, puedes perderte el link el día del evento.</strong>
          </p>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
            onClick={() => { opened.current = true; }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M23.5 8.5C21.7 6.7 19.4 5.7 17 5.7c-4.9 0-8.8 3.9-8.8 8.8 0 1.6.4 3.1 1.2 4.4L8 24.3l5.5-1.4c1.3.7 2.7 1.1 4.2 1.1h.1c4.9 0 8.8-3.9 8.8-8.8-.1-2.4-1.1-4.6-2.8-6.3z" fill="white"/>
            </svg>
            Unirme al grupo ahora
          </a>

          {secs > 0 && (
            <p className="wa-countdown">Abriendo automáticamente en <strong>{secs}s</strong>…</p>
          )}
        </div>

        <p className="wa-footnote">
          Ya tienes tu lugar asegurado. El grupo es donde pasa todo antes, durante y después del evento.
        </p>
      </div>
    </div>
  );
}

// ─── PHONE COUNTRY INPUT ───────────────────────────────────
const PHONE_COUNTRIES = [
  { name: "México",              flag: "🇲🇽", dial: "+52"  },
  { name: "Colombia",            flag: "🇨🇴", dial: "+57"  },
  { name: "Argentina",           flag: "🇦🇷", dial: "+54"  },
  { name: "Chile",               flag: "🇨🇱", dial: "+56"  },
  { name: "Perú",                flag: "🇵🇪", dial: "+51"  },
  { name: "Venezuela",           flag: "🇻🇪", dial: "+58"  },
  { name: "Ecuador",             flag: "🇪🇨", dial: "+593" },
  { name: "Guatemala",           flag: "🇬🇹", dial: "+502" },
  { name: "Bolivia",             flag: "🇧🇴", dial: "+591" },
  { name: "Rep. Dominicana",     flag: "🇩🇴", dial: "+1"   },
  { name: "Honduras",            flag: "🇭🇳", dial: "+504" },
  { name: "El Salvador",         flag: "🇸🇻", dial: "+503" },
  { name: "Costa Rica",          flag: "🇨🇷", dial: "+506" },
  { name: "Panamá",              flag: "🇵🇦", dial: "+507" },
  { name: "Uruguay",             flag: "🇺🇾", dial: "+598" },
  { name: "Paraguay",            flag: "🇵🇾", dial: "+595" },
  { name: "Nicaragua",           flag: "🇳🇮", dial: "+505" },
  { name: "Estados Unidos",      flag: "🇺🇸", dial: "+1"   },
  { name: "España",              flag: "🇪🇸", dial: "+34"  },
  { name: "Canadá",              flag: "🇨🇦", dial: "+1"   },
  { name: "Otro",                flag: "🌍",  dial: "+"    },
];

type PhoneCountry = typeof PHONE_COUNTRIES[number];

function PhoneCountryInput({
  value, onChange, onCountryChange, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onCountryChange: (c: PhoneCountry) => void;
  placeholder?: string;
}) {
  const [selected, setSelected] = useState<PhoneCountry>(PHONE_COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(c: PhoneCountry) {
    setSelected(c);
    onCountryChange(c);
    setOpen(false);
    setSearch("");
  }

  const filtered = search
    ? PHONE_COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search)
      )
    : PHONE_COUNTRIES;

  return (
    <div className="phone-field" ref={wrapRef}>
      <button
        type="button"
        className={`phone-flag-btn ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Seleccionar país"
      >
        <span className="phone-flag-emoji">{selected.flag}</span>
        <span className="phone-dial">{selected.dial}</span>
        <svg className="phone-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <input
        className="phone-number-input"
        type="tel"
        name="whatsapp"
        id="whatsapp"
        placeholder={placeholder ?? "55 1234 5678"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      {open && (
        <div className="phone-dropdown">
          <div className="phone-search-wrap">
            <input
              className="phone-search"
              type="text"
              placeholder="Buscar país..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="phone-list">
            {filtered.map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  className={`phone-option ${c.name === selected.name ? "active" : ""}`}
                  onClick={() => select(c)}
                >
                  <span className="phone-flag-emoji">{c.flag}</span>
                  <span className="phone-option-name">{c.name}</span>
                  <span className="phone-option-dial">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  useReveal();
  useTracker();
  const countdown = useCountdown(content.hero.countdown_target);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(PHONE_COUNTRIES[0]);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = formRef.current!;
    const params = new URLSearchParams(window.location.search);

    const getCookie = (name: string) =>
      document.cookie.split("; ").find((r) => r.startsWith(name + "="))?.split("=")[1] ?? "";

    const eventId = crypto.randomUUID();

    const payload = {
      nombre:           (form.elements.namedItem("name")  as HTMLInputElement).value,
      email:            (form.elements.namedItem("email") as HTMLInputElement).value,
      telefono:         `${phoneCountry.dial} ${phoneVal}`.trim(),
      pais:             phoneCountry.name,
      utm_source:       params.get("utm_source")   ?? "",
      utm_medium:       params.get("utm_medium")   ?? "",
      utm_campaign:     params.get("utm_campaign") ?? "",
      utm_content:      params.get("utm_content")  ?? "",
      utm_term:         params.get("utm_term")     ?? "",
      event_id:         eventId,
      event_source_url: window.location.href,
      fbc:              getCookie("_fbc"),
      fbp:              getCookie("_fbp"),
    };

    try {
      await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // silent
    }

    try {
      getTracker()?.conversion({ email: payload.email, country: payload.pais });
    } catch { /* noop */ }

    // Meta browser pixel — mismo event_id que el CAPI para deduplicación
    trackMetaLead(eventId, {
      utm_source:   payload.utm_source,
      utm_medium:   payload.utm_medium,
      utm_campaign: payload.utm_campaign,
      utm_content:  payload.utm_content,
      utm_term:     payload.utm_term,
      country:      payload.pais,
    });

    setRegisteredName(payload.nombre.split(" ")[0]);
    setSubmitted(true);
    setLoading(false);
  }

  const [dbSpeakers, setDbSpeakers] = useState<Speaker[] | null>(null);

  useEffect(() => {
    const w = window as IdleWindow;
    const load = () => {
      fetch("/api/speakers")
        .then((r) => r.json())
        .then((data: unknown) => {
          if (!Array.isArray(data) || data.length === 0) return;
          const mapped = (data as Array<Record<string, unknown>>).map((sp) => ({
            name:     String(sp.name ?? ""),
            role:     sp.role     ? String(sp.role)     : null,
            title:    String(sp.title   ?? ""),
            topic:    String(sp.topic   ?? ""),
            pillar:   sp.pillar   ? (String(sp.pillar) as Speaker["pillar"])  : undefined,
            ig:       sp.ig       ? String(sp.ig)       : undefined,
            photo:    sp.photo_url ? String(sp.photo_url) : undefined,
            featured: Boolean(sp.featured),
            initial:  String(sp.name ?? "").slice(0, 1),
          }));
          setDbSpeakers(mapped);
        })
        .catch(() => {});
    };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(load, { timeout: 5000 });
    } else {
      w.setTimeout(load, 3000);
    }
  }, []);

  const speakers = useMemo(
    () => dbSpeakers ?? content.speakers.list,
    [dbSpeakers]
  );

  if (submitted) return <WhatsAppTakeover nombre={registeredName} />;

  return (
    <>
      {/* ─── TOP BAR ─────────────────────────────────────── */}
      <div className="topbar">
        <div className="container">
          <div className="topbar-inner">
            <p className="topbar-text">
              <strong>{content.topbar.date}</strong> · {content.topbar.online} ·{" "}
              <span className="accent">{content.topbar.free}</span>
            </p>
            <a href="#registro" className="btn-topbar" data-track="topbar_cta">{content.topbar.cta}</a>
          </div>
        </div>
      </div>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="hero" data-section="hero">
        <HeroBg />
        <div className="container" style={{ width: "100%" }}>
          <div className="hero-content">
            <div className="hero-logo-wrap">
              <img
                src="/nuevoboot.webp"
                alt="Bootcamp de Aceleración de Emprendimiento Synergy Education 2026"
                className="hero-logo"
                width={1200}
                height={355}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <h1>{content.hero.h1_part1}<br /><em>{content.hero.h1_em}</em></h1>
            <p className="hero-sub">{content.hero.subhead}</p>
            <div className="hero-price">
              {content.hero.price_strike && <span className="hero-price-strike">{content.hero.price_strike}</span>}
              <span className="hero-price-now">{content.hero.price_now}</span>
            </div>
            <div className="hero-live-badge">
              <span className="hero-live-dot" aria-hidden="true"></span>
              EN VIVO · Sin grabación · Sin repetición
            </div>
            <div className="hero-date">
              <span className="hero-date-nums">{content.hero.date_nums}</span>
              <span className="hero-date-sep" />
              <span className="hero-date-month">{content.hero.date_month}</span>
              <span className="hero-date-sep" />
              <span className="hero-date-tag">{content.hero.date_tag}</span>
            </div>
            {!countdown.done && (
              <div className="hero-countdown">
                <span className="hero-countdown-label">{content.hero.countdown_label}</span>
                <div className="hero-countdown-units">
                  <div className="hero-countdown-unit">
                    <span className="hero-countdown-num">{String(countdown.d).padStart(2, "0")}</span>
                    <span className="hero-countdown-tag">días</span>
                  </div>
                  <span className="hero-countdown-colon">:</span>
                  <div className="hero-countdown-unit">
                    <span className="hero-countdown-num">{String(countdown.h).padStart(2, "0")}</span>
                    <span className="hero-countdown-tag">horas</span>
                  </div>
                  <span className="hero-countdown-colon">:</span>
                  <div className="hero-countdown-unit">
                    <span className="hero-countdown-num">{String(countdown.m).padStart(2, "0")}</span>
                    <span className="hero-countdown-tag">min</span>
                  </div>
                  <span className="hero-countdown-colon">:</span>
                  <div className="hero-countdown-unit">
                    <span className="hero-countdown-num">{String(countdown.s).padStart(2, "0")}</span>
                    <span className="hero-countdown-tag">seg</span>
                  </div>
                </div>
              </div>
            )}
            <div className="hero-cta-group">
              <a href="#registro" className="btn-primary" data-track="hero_cta">
                {content.hero.cta} <ArrowRight />
              </a>
            </div>
          </div>

          {/* hero-stats hidden */}
        </div>
      </section>

      {/* ─── HOSTS (Jorge + Manuel) ──────────────────────── */}
      <section className="credentials section" data-section="host">
        <div className="credentials-inner container">
          <div className="credentials-hosts">
            {content.credentials.hosts.map((host) => (
              <div key={host.name_1} className="credentials-host-block">
                <div className="credentials-layout">
                  <div className="credentials-photo reveal">
                    <NextImage
                      src={host.photo}
                      alt={`${host.name_1} ${host.name_em}`}
                      className="credentials-portrait"
                      width={180}
                      height={220}
                      priority
                      sizes="(max-width: 640px) min(160px, 45vw), 180px"
                    />
                  </div>
                  <div className="credentials-text reveal reveal-delay-1">
                    <div className="host-badge">{host.badge}</div>
                    <h2>{host.name_1} <span className="text-red">{host.name_em}</span></h2>
                    {host.bio.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className="credentials-stats">
                  {host.stats.map((s, i) => (
                    <div key={i} className={`cred-stat reveal reveal-delay-${i + 1}`}>
                      <div className="cred-stat-number">{s.number}</div>
                      <div className="cred-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-cta reveal">
          <a href="#registro" className="btn-primary" data-track="credentials_cta">
            Quiero estar en el Bootcamp <ArrowRight />
          </a>
        </div>
      </section>

      {/* ─── SPEAKERS ────────────────────────────────────── */}
      <section className="speakers section" data-section="speakers">
        <div className="container">
          <div className="speakers-header">
            <span className="section-label reveal">{content.speakers.label}</span>
            <h2 className="section-title reveal reveal-delay-1">
              {content.speakers.title_1} <span className="text-red">{content.speakers.title_em}</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto" }}>
              {content.speakers.subtitle}
            </p>
          </div>
          <div className="speakers-grid">
            {speakers.map((s, i) => (
              <div key={s.name} className={`reveal reveal-delay-${(i % 4) + 1}`}>
                <SpeakerCard s={s} />
              </div>
            ))}
          </div>
          <p className="speakers-note reveal">{content.speakers.note}</p>
          <div className="section-cta reveal">
            <a href="#registro" className="btn-primary" data-track="speakers_cta">
              Quiero aprender de ellos <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* ─── 3 PILLARS ANIMATION ────────────────────────── */}
      <PillarsSection />

      {/* ─── PROBLEM ─────────────────────────────────────── */}
      <section className="problem section" data-section="problem">
        <div className="container">
          <div className="problem-grid">
            <div>
              <span className="section-label reveal">{content.problem.label}</span>
              <h2 className="section-title reveal reveal-delay-1">
                {content.problem.title_1} <span className="text-red">{content.problem.title_em}</span>
              </h2>
              <p className="reveal reveal-delay-2" style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 0 }}>
                {content.problem.body}
              </p>
              <ul className="problem-bullets">
                {content.problem.bullets.map((text, i) => (
                  <li key={i} className={`reveal reveal-delay-${(i % 4) + 1} problem-pain-item`}>
                    <span className="bullet-icon"><CheckCircle /></span>{text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal reveal-delay-2">
              <div className="problem-quote">{content.problem.quote}</div>
              <div className="problem-callout">
                <p className="problem-callout-title">{content.problem.callout_title}</p>
                <p className="problem-callout-text">{content.problem.callout_body}</p>
              </div>
            </div>
          </div>

          {/* Ruta de 3 días */}
          <div className="journey reveal">
            <div className="journey-head">
              <span className="journey-eyebrow">{content.problem.journey.eyebrow}</span>
              <h3 className="journey-title">{content.problem.journey.title}</h3>
            </div>
            <div className="journey-track">
              {content.problem.journey.steps.map((step, i) => (
                <div key={i} className="journey-step">
                  <div className="journey-day">{step.day}</div>
                  <div className="journey-dot" aria-hidden="true"></div>
                  <div className="journey-tag">{step.tag}</div>
                  <h4 className="journey-step-title">{step.title}</h4>
                  <p className="journey-step-body">{step.body}</p>
                </div>
              ))}
              <div className="journey-arrow" aria-hidden="true">→</div>
              <div className="journey-step journey-result">
                <div className="journey-day">FIN</div>
                <div className="journey-dot journey-dot-final" aria-hidden="true"></div>
                <h4 className="journey-step-title">{content.problem.journey.result}</h4>
              </div>
            </div>
          </div>
          <div className="section-cta reveal">
            <a href="#registro" className="btn-primary" data-track="problem_cta">
              Quiero romper ese techo <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS A BOOTCAMP ─────────────────────────── */}
      <WhatIsBootcamp />

      {/* ─── CALCULATOR ──────────────────────────────────── */}
      <RoiCalculator />

      {/* ─── DETAILS ─────────────────────────────────────── */}
      <section className="details section" data-section="details">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span className="section-label reveal">{content.details.label}</span>
            <h2 className="section-title reveal reveal-delay-1">{content.details.title}</h2>
          </div>
          <div className="details-grid">
            {content.details.items.map((item, i) => (
              <div key={i} className={`detail-item reveal reveal-delay-${i + 1}`}>
                <div className="detail-icon">{detailIcons[i]}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <div className="section-cta reveal">
            <a href="#registro" className="btn-primary" data-track="details_cta">
              Asegurar mi lugar — es gratis <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* ─── PRIZES (RULETA) ─────────────────────────────── */}
      <PrizesRoulette />

      {/* ─── TESTIMONIALS ────────────────────────────────── */}
      <section className="testimonials section" data-section="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <span className="section-label reveal">{content.testimonials.label}</span>
            <h2 className="section-title reveal reveal-delay-1">
              {content.testimonials.title_1} <span className="text-red">{content.testimonials.title_em}</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto" }}>
              {content.testimonials.subtitle}
            </p>
          </div>
          <div className="testimonials-grid">
            {content.testimonials.items.map((t, i) => (
              <div key={i} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
                <div className="testimonial-mark">&ldquo;</div>
                <p className="testimonial-text">{t.quote}</p>
                <div className="testimonial-result">{t.result}</div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
          {content.testimonials.featured_quote && (
            <div className="featured-quote-block reveal">
              <div className="featured-quote-text">&ldquo;{content.testimonials.featured_quote}&rdquo;</div>
              <div className="featured-quote-author">
                — <span>{content.testimonials.featured_author}</span>, {content.testimonials.featured_role}
              </div>
            </div>
          )}
          <div className="section-cta reveal">
            <a href="#registro" className="btn-primary" data-track="testimonials_cta">
              Quiero ser el próximo caso de éxito <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* ─── BONUS ───────────────────────────────────────── */}
      <section className="bonus section-sm" data-section="bonus">
        <div className="container">
          <div className="bonus-card reveal">
            <div className="bonus-card-inner">
              <div className="bonus-icon">🎙️</div>
              <div className="bonus-tag">{content.bonus.tag}</div>
              <h2>{content.bonus.title_1} <span className="text-gold">{content.bonus.title_em}</span></h2>
              <p>
                {content.bonus.body_intro}{" "}
                <strong style={{ color: "var(--white)" }}>{content.bonus.body_product}</strong>{" "}
                {content.bonus.body_mid}{" "}
                <span className="bonus-highlight">{content.bonus.body_rank}</span> — con más de{" "}
                <span className="bonus-highlight">{content.bonus.body_reach}</span> {content.bonus.body_end}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REGISTRATION ────────────────────────────────── */}
      <section className="registration section" id="registro" data-section="registration">
        <div className="registration-inner container">
          <span className="section-label reveal">{content.registration.label}</span>
          <h2 className="reveal reveal-delay-1">
            {content.registration.title_1} <span className="text-red">{content.registration.title_em}</span>
          </h2>
          <p className="registration-sub reveal reveal-delay-2">
            {content.registration.subtitle.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </p>

          <div className="form-card reveal reveal-delay-2">
            {submitted ? (
              <div className="form-success-state">
                <div className="success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="success-title">{content.registration.success.title}</h3>
                <p className="success-sub">
                  {content.registration.success.message.split("\n").map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">{content.registration.form.name_label}</label>
                  <input className="form-input" type="text" id="name" name="name" placeholder={content.registration.form.name_placeholder} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">{content.registration.form.email_label}</label>
                  <input className="form-input" type="email" id="email" name="email" placeholder={content.registration.form.email_placeholder} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="whatsapp">{content.registration.form.whatsapp_label}</label>
                  <PhoneCountryInput
                    value={phoneVal}
                    onChange={setPhoneVal}
                    onCountryChange={setPhoneCountry}
                    placeholder={content.registration.form.whatsapp_placeholder}
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={loading} data-track="registration_submit">
                  {loading ? content.registration.form.cta_loading : (
                    <>{content.registration.form.cta} <ArrowRight /></>
                  )}
                </button>
                <p className="form-disclaimer">
                  <Lock />
                  {content.registration.form.disclaimer}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="footer" data-section="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">{content.footer.logo_1}<span>{content.footer.logo_em}</span></div>
              <p className="footer-copy">{content.footer.copy}</p>
              <a href={`https://${content.footer.url}`} className="footer-url">{content.footer.url}</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <ul className="footer-links">
                {content.footer.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} data-track={`footer_link_${l.href}`}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Contacto</div>
              <p className="footer-contact">{content.footer.contact.company}</p>
              <a href={`mailto:${content.footer.contact.email}`} className="footer-contact-link">{content.footer.contact.email}</a>
            </div>
          </div>

          <div className="footer-disclaimers">
            {content.footer.disclaimers.map((d, i) => (
              <p key={i} className="footer-disclaimer-text">{d}</p>
            ))}
          </div>
        </div>
      </footer>

      {/* ─── SOCIAL PROOF POPUP ──────────────────────────── */}
      <SocialProofPopup />

      {/* ─── REPLAY GATE (activa el 9 de junio) ──────────── */}
      <ReplayGate />
    </>
  );
}
