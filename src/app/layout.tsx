import type { Metadata, Viewport } from "next";
import { Outfit, Poppins } from "next/font/google";
import Script from "next/script";
import { content } from "./content";
import { MetaPixel } from "@/components/MetaPixel";
import "./globals.css";

const GTM_ID     = "GTM-WT69C6ZM";
const GA4_ID     = "G-JLXX6HZ1M5";
const CLARITY_ID = "wn3199zxx5";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-head",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const SITE_URL  = content.seo.url;
const OG_IMAGE  = `${SITE_URL}/og-bootcamp-2026.jpg`;

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  content.seo.title,
    template: "%s · Synergy Education",
  },
  description: content.seo.description,
  keywords: content.seo.keywords,
  applicationName: "Synergy Education · Bootcamp 2026",
  authors: [{ name: "Synergy Education", url: SITE_URL }],
  creator: "Synergy Education",
  publisher: "Sinergéticos",
  category: "Education",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-MX": SITE_URL,
      "es":    SITE_URL,
      "x-default": SITE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Synergy Education",
    title:    content.seo.title,
    description: content.seo.description,
    url: SITE_URL,
    locale: "es_MX",
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: "Bootcamp de Aceleración de Emprendimiento 2026" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.seo.title,
    description: content.seo.description,
    images: [OG_IMAGE],
    site: "@sinergeticos",
    creator: "@jorgeserratos",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "",      // rellenar si se valida con Search Console
  },
  other: {
    "fb:app_id":   "",
    "og:site_name": "Synergy Education",
  },
};

// JSON-LD para SEO enriquecido (Event + Organization + FAQPage + BreadcrumbList)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id":  `${SITE_URL}#organization`,
      name:   "Synergy Education · Sinergéticos",
      url:    SITE_URL,
      logo:   `${SITE_URL}/logo-bootcamp.webp`,
      description: "Ecosistema de aceleración de emprendedores hispanos liderado por Jorge Serratos.",
      sameAs: [
        "https://www.instagram.com/jorgeserratos/",
        "https://www.instagram.com/sinergeticos/",
        "https://www.youtube.com/@JorgeSerratos",
        "https://open.spotify.com/show/3Fdo3WXdeK8fQVobPFICpQ",
      ],
      contactPoint: [{
        "@type": "ContactPoint",
        email: content.footer.contact.email,
        contactType: "customer support",
        availableLanguage: ["Spanish", "English"],
      }],
    },
    {
      "@type": "Event",
      "@id":   `${SITE_URL}#event`,
      name:    "Bootcamp de Aceleración de Emprendimiento 2026",
      description: content.seo.description,
      startDate: "2026-06-05T09:00:00-06:00",
      endDate:   "2026-06-07T22:00:00-06:00",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "VirtualLocation",
        url: SITE_URL,
      },
      image: [OG_IMAGE],
      organizer: { "@id": `${SITE_URL}#organization` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/LimitedAvailability",
        validFrom: "2026-04-01T00:00:00-06:00",
        url: `${SITE_URL}#registro`,
        description: "Acceso digital de cortesía registrándose antes del 20 de mayo. Valor regular: $497 USD.",
      },
      performer: content.speakers.list.map((s) => ({
        "@type": "Person",
        name:    s.name,
        description: s.title,
        ...(s.ig ? { sameAs: [`https://instagram.com/${s.ig}`] } : {}),
      })),
      inLanguage: "es",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "¿Cuánto cuesta el Bootcamp?", acceptedAnswer: { "@type": "Answer", text: "El valor del evento es de $497 USD. Si te registras antes del 20 de mayo, obtienes un acceso digital de cortesía 100% gratis." } },
        { "@type": "Question", name: "¿Dónde se realiza el Bootcamp?", acceptedAnswer: { "@type": "Answer", text: "Es 100% online, en vivo. Puedes conectarte desde cualquier país." } },
        { "@type": "Question", name: "¿Cuándo es el Bootcamp?", acceptedAnswer: { "@type": "Answer", text: "5, 6 y 7 de junio de 2026." } },
        { "@type": "Question", name: "¿Quiénes son los speakers?", acceptedAnswer: { "@type": "Answer", text: "Más de 21 referentes hispanos como Daniel Marcos, Fernando Anzures, Claudia Lizaldi, Coral Mujaes, Alejandro Kasuga, Spencer Hoffmann, entre otros." } },
        { "@type": "Question", name: "¿Habrá premios?", acceptedAnswer: { "@type": "Answer", text: "Sí — sorteamos más de $10,000 USD en premios: iPads, MacBooks, accesos a eventos, experiencias y becas." } },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${poppins.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="beforeInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
        {/* Google Analytics 4 */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
        `}</Script>
        {/* Microsoft Clarity */}
        <Script id="clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_ID}");
        `}</Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
