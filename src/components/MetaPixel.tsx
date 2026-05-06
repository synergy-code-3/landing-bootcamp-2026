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

export function trackMetaLead(eventId: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "Lead", {
    content_name:     "Bootcamp 2026",
    content_category: "bootcamp",
    currency:         "MXN",
    value:            0,
    ...params,
  }, { eventID: eventId });
}
