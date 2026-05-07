"use client";

import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID!;

declare global {
  // eslint-disable-next-line no-var
  var fbq: ((...args: unknown[]) => void) & { queue?: unknown[] };
}

export function MetaPixel() {
  if (!PIXEL_ID) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
        n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
        s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
        (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','${PIXEL_ID}');
        fbq('track','PageView');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1" width="1" style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

async function sha256Browser(value: string): Promise<string> {
  const data    = new TextEncoder().encode(value.trim().toLowerCase());
  const buffer  = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function trackMetaLead(
  eventId: string,
  params: Record<string, unknown> & { email?: string; phone?: string } = {}
) {
  if (typeof window === "undefined" || !window.fbq) return;

  const { email, phone, ...rest } = params;

  const advancedMatching: Record<string, string> = {};
  if (email) advancedMatching.em = await sha256Browser(email);
  if (phone) advancedMatching.ph = await sha256Browser(phone.replace(/\D/g, ""));

  if (Object.keys(advancedMatching).length) {
    window.fbq("init", PIXEL_ID, advancedMatching);
  }

  window.fbq("track", "Lead", {
    content_name:     "Bootcamp 2026",
    content_category: "bootcamp",
    currency:         "MXN",
    value:            0,
    ...rest,
  }, { eventID: eventId });
}
