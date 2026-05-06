// ─── CONTENIDO DE LA LANDING ─────────────────────────────────────────────────
// Edita los textos aquí. Los cambios se reflejan automáticamente en la página.

export interface Speaker {
  name:      string;
  role?:     string | null;     // "Host", "Co-host" o null
  title:     string;            // bio corta (quién es)
  topic:     string;            // de qué va a hablar en el Bootcamp
  pillar?:   "Entorno y Relaciones" | "Ventas y Utilidad" | "Mentalidad y Decisiones";
  ig?:       string;            // handle sin @
  photo?:    string;            // ruta a /public/speakers/<handle>.jpg (fallback a iniciales)
  featured?: boolean;
  initial?:  string;
  bg?:       string;
}

export const content = {

  // ─── REPLAY MODE (a partir del 9 de junio de 2026) ──────────────────────
  // Después de esta fecha, la home muestra un pop-up redirigiendo a /repeticion
  // donde la persona se registra para ver la repetición. Se activa automáticamente.
  replay: {
    enabled_from: "2026-06-09T00:00:00-06:00", // America/Mexico_City
    alt_path:     "/repeticion",
    popup_title:  "El Bootcamp ya terminó en vivo",
    popup_body:   "Puedes registrarte para ver la repetición por tiempo limitado. Solo para personas que no pudieron conectarse los días 5, 6 y 7 de junio.",
    popup_cta:    "Ver repetición",
    popup_dismiss: "Cerrar",
  },

  // ─── SEO ─────────────────────────────────────────────────────────────────
  seo: {
    title:       "Bootcamp de Aceleración de Emprendimiento 2026 · Synergy Education",
    description: "3 días en vivo con +20 speakers internacionales (Daniel Marcos, Fernando Anzures, Claudia Lizaldi, Coral Mujaes, Alejandro Kasuga y más). Mentalidad, ventas digitales y alto rendimiento. Acceso digital gratuito. 5, 6 y 7 de Junio 2026.",
    url:         "https://synergyforeducation.mx",
    keywords: [
      "bootcamp emprendimiento",
      "synergy education",
      "sinergéticos 2026",
      "bootcamp online",
      "curso negocios latam",
      "marketing digital",
      "ventas digitales",
      "Jorge Serratos",
      "Daniel Marcos",
      "Fernando Anzures",
      "Claudia Lizaldi",
      "Alejandro Kasuga",
      "Coral Mujaes",
      "emprendedores latam",
      "aceleración de negocios",
      "evento online negocios 2026",
    ].join(", "),
  },

  // ─── TOP BAR ──────────────────────────────────────────────────────────────
  topbar: {
    date:   "5, 6 y 7 de Junio 2026",
    online: "EN VIVO · Sin repetición · Sin grabación",
    free:   "Acceso digital 100% gratuito",
    cta:    "Asegura tu lugar",
  },

  // ─── HERO ─────────────────────────────────────────────────────────────────
  hero: {
    badge:    "Evento Synergy Education · 3 Días · +20 Speakers",
    h1_part1: "Transforma tu negocio",
    h1_em:    "en 3 días",
    subhead:  "3 días en vivo donde atacamos los 3 ejes que frenan tu negocio: mentalidad, ventas y entorno. Más de 20 speakers internacionales. Acceso digital gratuito.",
    date_nums:  "5, 6 y 7",
    date_month: "Junio 2026",
    date_tag:   "100% online · Acceso gratuito",
    cta:        "Reserva tu lugar gratuito",
    price_strike: "",
    price_now:    "Acceso 100% GRATIS",
    countdown_label: "Cierre de registros en:",
    countdown_target: "2026-06-05T00:00:00-06:00",
  },

  // ─── STATS ────────────────────────────────────────────────────────────────
  stats: [
    { number: "21+",   label: "Speakers"       },
    { number: "3",     label: "Días en vivo"   },
    { number: "$10K+", label: "USD en premios" },
  ],

  // ─── PROBLEMA ─────────────────────────────────────────────────────────────
  problem: {
    label:    "La brecha real",
    title_1:  "El sistema que te enseñaron está diseñado para empleados,",
    title_em: "no para dueños.",
    body:      "Si intentaste escalar antes y no funcionó, no fallaste tú — fallaron los métodos que no estaban hechos para el tipo de empresario que eres.",
    bullets: [
      "Llevas +2 años con el mismo techo de facturación — aunque trabajas más horas que nunca",
      "Sabes que tu producto vale más caro, pero cada vez que piensas en subir el precio te agarra el miedo",
      "Tu negocio depende de decisiones que solo tú puedes tomar — sin sistema, sin equipo, sin salida",
      "Tu negocio depende 100% de ti. Si paras, todo se detiene. Vacaciones, enfermedad, distracción: cero ingresos",
    ],
    quote: "Lo que hoy te limita, en 3 días puede dejar de existir.",
    callout_title: "El Bootcamp es el punto de quiebre.",
    callout_body:  "No otro curso. No otra motivación. Tres días en vivo — sin grabación, sin repetición — donde los 3 ejes del método Acelerar operan en paralelo: tu mentalidad, tus ventas y tu entorno.",
    journey: {
      eyebrow: "Así funciona el Bootcamp",
      title:   "3 días. 3 ejes. Un negocio que escala.",
      steps: [
        { day: "Día 1", tag: "Tu mentalidad y toma de decisiones", title: "Rompe el techo invisible",  body: "Identificarás el patrón mental que hoy limita tu crecimiento y lo cambiarás por el sistema operativo del empresario: decisiones por ROI, delegación real y margen sobre esfuerzo." },
        { day: "Día 2", tag: "Tus ventas y utilidad",              title: "Más ingresos, mejor margen", body: "Las 3 palancas en acción: precio, volumen y recurrencia. Aprenderás a posicionarte premium, atraer clientes en automático y convertir compras únicas en ingresos recurrentes." },
        { day: "Día 3", tag: "Tu entorno y relaciones",            title: "Cambia tu ecosistema",       body: "Tu próximo nivel depende de tu siguiente círculo. Conectarás con +20 speakers y miles de emprendedores que ya operan al nivel al que tú quieres llegar." },
      ],
      result: "Saldrás con los 3 ejes moviéndose en paralelo — eso es lo que hace la diferencia entre crecer y escalar.",
    },
  },

  // ─── "¿QUÉ ES UN BOOTCAMP?" ──────────────────────────────────────────────
  whatIs: {
    label:    "Esto no existe en el mercado hispano",
    title_1:  "Esto",
    title_em: "NO es",
    title_2:  "otro curso.",
    intro:    "Esto no se vende en ningún lado. No se repite. No queda grabado. Son 3 días intensivos donde cada sesión termina con algo implementado — diseñado para emprendedores que ya están ocupados generando ingresos, no para estudiantes buscando motivación.",
    notHeader: "Lo que NO estás a punto de recibir",
    notItems: [
      { t: "No es un curso grabado",     d: "40 horas de video que nunca terminas. Que se acumulan en tu drive junto a los otros 8 que compraste." },
      { t: "No es otro webinar",         d: "60 minutos de humo con un pitch al final. Sales igual que entraste." },
      { t: "No es mentoría 1 a 1 lenta", d: "6 meses de llamadas para ver qué pasa. Aquí se mueve todo en 72 horas." },
      { t: "No es motivación vacía",     d: "No vas a salir 'inspirado'. Vas a salir con un plan ejecutado, no con ganas." },
      { t: "No es teoría universitaria", d: "Cero modelos académicos. Solo lo que funciona en negocios reales con dinero real moviéndose." },
    ],
    bridge: "En cambio, esto es lo que SÍ pasa aquí",
    isHeader: "Esto es lo que sí pasa en el Bootcamp",
    isItems: [
      { t: "Inmersión total · EN VIVO",  d: "3 días comprimidos. Sin repetición. Sin grabación. Si no estás conectado, te lo perdiste." },
      { t: "Ejecutas mientras aprendes", d: "Subes precios, rediseñas oferta y activas canales durante el Bootcamp. Los resultados empiezan el mismo día." },
      { t: "+21 speakers en un solo evento", d: "Daniel Marcos, Fernando Anzures, Claudia Lizaldi, Alejandro Kasuga, Coral Mujaes… juntos. No existe en otro lugar." },
      { t: "Comunidad que ya factura",   d: "Miles de emprendedores hispanos conectados en vivo. El networking de 3 días que sigue dando frutos mucho después del evento." },
      { t: "+$10,000 USD en premios",    d: "Sorteos en vivo: iPads, MacBooks, accesos premium. Solo para quienes están presentes." },
    ],
    closing_1: "Esto es una",
    closing_em: "decisión de 3 días",
    closing_2: "que transforma tu negocio.",
    closing_foot: "Si eres de los que ejecutan — no de los que coleccionan cursos — fue diseñado exactamente para ti.",
    live_badge: "SOLO EN VIVO · Sin grabación",
  },

  // ─── 3 PILARES DEL MÉTODO ACELERAR ──────────────────────────────────────
  pillars: {
    label:    "Método Acelerar",
    title_1:  "3 ejes que transforman",
    title_em: "tu negocio",
    subtitle: "No son temas aislados. Son los 3 ejes que se mueven en paralelo. Ninguno funciona solo — los 3 juntos cambian el juego.",
    items: [
      {
        n: "01",
        tag: "Tu entorno y relaciones",
        title: "Cambia tu ecosistema",
        headline: "Tu próximo nivel depende de tu siguiente círculo.",
        body: "No se crece solo. Conectas con +20 speakers y miles de emprendedores que ya operan al nivel al que tú quieres llegar. Las relaciones que construyes en 3 días siguen dando frutos mucho después del evento.",
        bullets: [
          "Networking con builders reales",
          "Mentores y socios estratégicos",
          "Comunidad que sostiene tu crecimiento",
        ],
        color: "#fbbf24",
      },
      {
        n: "02",
        tag: "Tus ventas y utilidad",
        title: "Más ingresos, mejor margen",
        headline: "Cobrar más. A más personas. Con más recurrencia.",
        body: "Las 3 palancas del crecimiento en acción: precio, volumen y recurrencia. Aprenderás a posicionarte premium, atraer clientes en automático y convertir compra única en ingresos recurrentes.",
        bullets: [
          "Pricing y posicionamiento premium",
          "Adquisición digital que no depende de ti",
          "Ingresos recurrentes y LTV",
        ],
        color: "#4ade80",
      },
      {
        n: "03",
        tag: "Tu mentalidad y toma de decisiones",
        title: "Piensa como empresario",
        headline: "El techo de tu negocio está en tu cabeza — hasta que lo rompes.",
        body: "Instalarás el sistema operativo del empresario: decisiones con datos, delegación real, margen sobre esfuerzo. Lo que hoy te frena no es tu mercado — es tu modelo mental.",
        bullets: [
          "De auto-empleado a dueño de negocio",
          "Decisiones por ROI, no por emoción",
          "Sistemas > esfuerzo",
        ],
        color: "#a78bfa",
      },
    ],
    synthesis: {
      title: "Los 3 ejes =",
      result: "negocio acelerado",
      caption: "Entorno + Ventas + Mentalidad. Cuando los 3 ejes operan al mismo tiempo, el negocio deja de ser lineal y empieza a escalar.",
    },
  },

  // ─── PROMESAS (backup legacy, no renderizado) ────────────────────────────
  promises: {
    label:    "Los 3 ejes",
    title_1:  "En 3 días vas a",
    title_em: "operar diferente",
    items: [
      { n: "01", title: "Vender más caro",      body: "Pricing, posicionamiento y construcción de oferta para que cobres lo que vales sin justificarte." },
      { n: "02", title: "A más personas",       body: "Sistemas de adquisición digital que no dependen del boca a boca. Atraes en automático y con intención." },
      { n: "03", title: "Con más recurrencia",  body: "Convertir compra única en relación. Ascensores de valor, suscripciones y programas que generan LTV." },
    ],
  },

  // ─── CALCULADORA ─────────────────────────────────────────────────────────
  calculator: {
    label:    "Velocidad · Calculadora de impacto",
    title_1:  "Esto es lo que significaría el Bootcamp",
    title_em: "para tu negocio",
    subtitle: "Pon tu ticket promedio y cuántos clientes atiendes al mes. Después mueve las 3 palancas — pricing, volumen y recurrencia — para ver tu facturación proyectada.",
    inputs: {
      ticket_label:    "Ticket promedio (USD)",
      ticket_hint:     "Lo que cobras por cliente hoy",
      clients_label:   "Clientes al mes",
      clients_hint:    "Promedio mensual actual",
    },
    levers: {
      price_label:      "Vender más caro",
      price_hint:       "Aumento de ticket (%)",
      volume_label:     "A más personas",
      volume_hint:      "Aumento de clientes (%)",
      recurrence_label: "Con más recurrencia",
      recurrence_hint:  "Ventas por cliente al año (x)",
    },
    outputs: {
      current_month:  "Facturación actual / mes",
      projected_month: "Proyección / mes",
      projected_year:  "Proyección / año",
      delta_year:      "Diferencia anual",
      cta:             "Quiero acelerar esto · Reservar lugar",
    },
    footnote: "Cálculo ilustrativo. El resultado real depende de tu ejecución — el Bootcamp te da el método.",
  },

  // ─── DETALLES DEL EVENTO ──────────────────────────────────────────────────
  details: {
    label: "El evento",
    title: "Tres días diseñados para que no salgas igual",
    items: [
      { title: "3 días inmersivos",              body: "Estrategias y herramientas que puedes aplicar mientras el evento está pasando." },
      { title: "+21 speakers internacionales",   body: "Los referentes de negocios, mentalidad y ventas en español, en un mismo espacio." },
      { title: "+$10,000 USD en premios",        body: "iPads, MacBooks, accesos a eventos, experiencias y becas educativas en sorteos en vivo." },
      { title: "100% online",                    body: "Desde donde estés. Sin vuelos, sin hotel, sin pretextos." },
    ],
  },

  // ─── PREMIOS ─────────────────────────────────────────────────────────────
  prizes: {
    label:    "Premios en vivo",
    title_1:  "+$10,000 USD en premios",
    title_em: "para asistentes",
    subtitle: "Sorteos distribuidos a lo largo de los 3 días. Solo participan quienes estén conectados en vivo.",
    items: [
      { icon: "📱", title: "iPad Pro",          body: "Último modelo para llevar tu negocio a todos lados." },
      { icon: "💻", title: "MacBook",           body: "La herramienta de trabajo del emprendedor serio." },
      { icon: "🎟️", title: "Accesos a eventos", body: "Entradas a nuestros siguientes eventos presenciales y Premium." },
    ],
    footnote: "Bases aplicables. Para participar debes estar registrado y conectado en vivo el día del sorteo.",
  },

  // ─── SPEAKERS ─────────────────────────────────────────────────────────────
  speakers: {
    label:    "Speakers confirmados",
    title_1:  "Los referentes del mundo hispano",
    title_em: "en 3 días",
    subtitle: "Negocios, ventas, marketing digital, mentalidad, finanzas y alto rendimiento. Todos en vivo.",
    mystery_name:  "Por revelar",
    mystery_title: "Próximo anuncio",
    note:     "La lista puede actualizarse. Seguimos los anuncios oficiales en redes.",
    list: [
      { name: "Jorge Serratos",     role: "Host",     title: "CEO Grupo Serlo · Doctor en derecho · Podcast Sinergéticos #1 Negocios México · +11M seguidores",
        topic: "Cómo construir un movimiento, no solo un negocio",
        featured: true, ig: "jorgeserratos", photo: "/speakers/jorgeserratos.webp", initial: "J", bg: "linear-gradient(135deg,#00e040,#005a18)" },

      { name: "Manuel de León",     role: "Co-host",  title: "COO Sinergéticos · Experto en IA, tráfico y contenido digital",
        topic: "IA + tráfico + contenido: el stack técnico del crecimiento en 2026",
        pillar: "Ventas y Utilidad", featured: true, ig: "manueldeleonmjr", photo: "/speakers/manueldeleon.webp", initial: "M", bg: "linear-gradient(135deg,#4ade80,#00a030)" },

      { name: "Efrén Martínez",     title: "PhD en logoterapia · Autor de 25 libros · Coach de líderes · 1M seguidores",
        topic: "Hazte dueño de ti: romper las programaciones mentales que te sabotean",
        pillar: "Mentalidad y Decisiones", ig: "efrenmartinezo", photo: "/speakers/efrenmartinez.webp", initial: "E", bg: "linear-gradient(135deg,#14b8a6,#134e4a)" },

      { name: "Salvador Alva",      title: "Empresario y speaker · Estrategia comercial y escalamiento",
        topic: "Estrategia comercial: cerrar ventas de 6 cifras sin depender de ti",
        pillar: "Ventas y Utilidad", ig: "s.dealba", photo: "/speakers/salvadoralva.webp", initial: "S", bg: "linear-gradient(135deg,#6366f1,#312e81)" },

      { name: "Pavo Gómez",         title: "Fundador GoLaunch · La agencia de lanzamientos #1 en México · Host del podcast Épicamente",
        topic: "Anatomía de un lanzamiento rentable: storytelling que convierte en frío",
        pillar: "Ventas y Utilidad", ig: "pavogomezorea", photo: "/speakers/pavogomez.webp", initial: "P", bg: "linear-gradient(135deg,#f43f5e,#881337)" },

      { name: "Luis Fallas",        title: "CEO Centro de Superación Personal · +25 años transformando vidas",
        topic: "Potencial máximo: cómo el desarrollo personal desbloquea ingresos reales",
        pillar: "Mentalidad y Decisiones", ig: "luis_fallas", photo: "/speakers/luisfallas.webp", initial: "L", bg: "linear-gradient(135deg,#8b5cf6,#4c1d95)" },

      { name: "Alejandro Cardona",  title: "Economista · Fundador Seminario Creando Riqueza · 517K seguidores",
        topic: "Crear riqueza con inversiones: el emprendedor que también es inversionista",
        pillar: "Ventas y Utilidad", ig: "alejandrocardonascr", photo: "/speakers/alejandrocardona.webp", initial: "A", bg: "linear-gradient(135deg,#fde047,#a16207)" },

      { name: "César Sánchez",      title: "Emprendedor",
        topic: "Emprendimiento y negocios",
        initial: "C", bg: "linear-gradient(135deg,#f97316,#7c2d12)", photo: "/speakers/cesarsanchez.webp" },

      { name: "Daniel Garcia",      title: "Especialista en relaciones internacionales",
        topic: "Relaciones internacionales y negocios globales",
        initial: "D", bg: "linear-gradient(135deg,#38bdf8,#0c4a6e)", photo: "/speakers/danielgarcia.webp" },

      { name: "Fer León",           title: "Fundadora Ojo de Miel · Podcast Emprende con Fer León",
        topic: "Cómo escalar un negocio físico y construir una marca con propósito",
        pillar: "Ventas y Utilidad", ig: "ferleonmx",
        initial: "F", bg: "linear-gradient(135deg,#4ade80,#065f46)", photo: "/speakers/ferleon.webp" },

      { name: "Memo Serrano",       title: "Business & Mindset Mentor · Proctor Gallagher Institute · Autor bestseller",
        topic: "Cómo reprogramar tu mentalidad financiera para escalar sin límites",
        pillar: "Mentalidad y Decisiones", ig: "memo_serrano_d",
        initial: "M", bg: "linear-gradient(135deg,#a855f7,#581c87)", photo: "/speakers/memoserrano.webp" },

      { name: "Ricardo Perret",     title: "Conferencista internacional · Autor de 11 libros · +1,200 conferencias en 20 países · Fundador La Montaña",
        topic: "El gen exitoso: los hábitos y la mentalidad que separan a los que escalan de los que se estancan",
        pillar: "Mentalidad y Decisiones", ig: "ricardo.perret",
        initial: "R", bg: "linear-gradient(135deg,#0ea5e9,#0c4a6e)", photo: "/speakers/ricardoperret.webp" },

      { name: "Regina Carrot",      title: "+14M seguidores · TEDx Speaker · Fundadora Speaker Magnética · Forbes · Ex Pepsico",
        topic: "Cómo construir una audiencia millonaria y monetizar tu mensaje",
        pillar: "Ventas y Utilidad", ig: "reginacarrot",
        initial: "R", bg: "linear-gradient(135deg,#ec4899,#831843)", photo: "/speakers/reginacarrot.webp" },

      { name: "Susi Vereecken",     title: "Directora Maxwell Leadership® LATAM · Coach internacional · Speaker",
        topic: "Liderazgo que escala: cómo desarrollar el equipo y la cultura que tu negocio necesita",
        pillar: "Entorno y Relaciones", ig: "susivv",
        initial: "S", bg: "linear-gradient(135deg,#eab308,#713f12)", photo: "/speakers/susivereecken.webp" },
    ] as Speaker[],
  },

  // ─── TESTIMONIOS ──────────────────────────────────────────────────────────
  testimonials: {
    label:    "Resultados reales",
    title_1:  "Personas que ya cruzaron",
    title_em: "al siguiente nivel",
    subtitle: "Empezaron donde estás tú hoy. Esto es lo que pasó.",
    items: [
      { quote: "Tenía un negocio físico que dependía de que la gente me conociera en persona. Tres días después del Bootcamp empecé a vender por WhatsApp. Hoy el 40% de mis clientes nunca me ha visto en persona.", result: "40% de ventas 100% digital", name: "Sandra Vargas", role: "Nutrióloga · CDMX" },
      { quote: "Me mudé a EE.UU. sin clientes y sin permiso de trabajo. Digitalicé mi curso de nail art y generé $9,000 USD en mi primer mes.", result: "$9,000 USD en el primer mes", name: "Janet", role: "México → Estados Unidos" },
      { quote: "Pasé de dar consultas a $200 USD a lanzar un programa de 8 semanas. 23 personas a $497 cada una.", result: "$11,431 USD en 30 días", name: "Carlos", role: "Asesor financiero" },
    ],
    featured_quote:  "",
    featured_author: "",
    featured_role:   "",
  },

  // ─── CREDENCIALES (Hosts) ─────────────────────────────────────────────────
  credentials: {
    hosts: [
      {
        badge:  "Host del Bootcamp",
        name_1: "Jorge",
        name_em: "Serratos",
        photo:  "/speakers/jorgeserratos.webp",
        bio:    "Hace 4 años era un abogado con un negocio exitoso pero topado: ingresos atados 100% a su presencia, sin margen para crecer. Llegó al límite y tomó la decisión de escalar.\n\nEscaló. Hoy dirige Grupo Serlo —6 empresas— y es el host de Sinergéticos, el podcast de negocios #1 en México con +11M de seguidores. Su filosofía: \"1+1=3\".",
        stats: [
          { number: "+11M",    label: "seguidores en todas sus plataformas" },
          { number: "+20,000", label: "emprendedores que ya convirtieron su conocimiento en un negocio digital rentable" },
          { number: "209M",    label: "personas de alcance · Podcast Sinergéticos #1 Negocios México · +100k calificaciones" },
        ],
      },
      {
        badge:  "Co-host del Bootcamp",
        name_1: "Manuel",
        name_em: "de León",
        photo:  "/speakers/manueldeleon.webp",
        bio:    "El arquitecto del stack digital de Sinergéticos. Lleva años convirtiendo visión en sistemas: IA, tráfico pagado y contenido que generan audiencias y clientes a escala.\n\nCOO de Sinergéticos y la mente detrás del crecimiento técnico que llevó el podcast al #1 en México. Su filosofía: la tecnología trabaja para ti — o tú trabajas para ella.",
        stats: [
          { number: "COO",     label: "Sinergéticos · el podcast de negocios #1 en México" },
          { number: "+11M",    label: "personas alcanzadas con la estrategia de IA y contenido que diseña y opera" },
          { number: "IA · Tráfico", label: "el stack técnico del crecimiento que enseña en el Bootcamp 2026" },
        ],
      },
    ],
  },

  // ─── BONO ─────────────────────────────────────────────────────────────────
  bonus: {
    tag:        "Solo para asistentes del Bootcamp",
    title_1:    "Sé entrevistado en el",
    title_em:   "Podcast #1 de Negocios",
    body_intro: "Quienes confirmen su",
    body_product: "Synergy Unlimited Black Access",
    body_mid:   "durante el evento entran al sorteo para ser entrevistados por Jorge Serratos en el podcast",
    body_rank:  "#1 en negocios en México",
    body_reach: "209 millones de personas de alcance",
    body_end:   "y más de 100,000 calificaciones.",
  },

  // ─── REGISTRO ─────────────────────────────────────────────────────────────
  registration: {
    label:    "Tu lugar te espera",
    title_1:  "Tres días que pueden",
    title_em: "cambiar el siguiente año",
    subtitle: "Cupos limitados. Regístrate y asegura tu acceso digital gratuito.\nEl Bootcamp es 100% en vivo, sin repetición.",
    form: {
      name_label:        "Nombre completo",
      name_placeholder:  "Tu nombre y apellido",
      email_label:       "Correo electrónico",
      email_placeholder: "tucorreo@ejemplo.com",
      whatsapp_label:       "WhatsApp (con lada)",
      whatsapp_placeholder: "+52 55 1234 5678",
      country_label:       "País",
      country_placeholder: "Selecciona tu país",
      cta:         "Reserva mi lugar gratuito",
      cta_loading: "Registrando...",
      disclaimer:  "Al registrarte aceptas recibir información sobre el evento y aceptas nuestra Política de Privacidad. Sin spam.",
    },
    success: {
      title:   "¡Ya tienes tu lugar!",
      message: "Revisa tu correo, te enviamos los detalles del Bootcamp.\nNos vemos el 5 de Junio de 2026.",
    },
  },

  // ─── SOCIAL-PROOF POP-UP ─────────────────────────────────────────────────
  popup: {
    title_prefix: "se registró al Bootcamp",
    urgency:      "Accesos de cortesía limitados · quedan pocos",
    people: [
      { name: "María G.",   city: "CDMX, MX",         minutes: 2  },
      { name: "Andrés R.",  city: "Bogotá, CO",       minutes: 3  },
      { name: "Valeria P.", city: "Guadalajara, MX",  minutes: 5  },
      { name: "Carlos E.",  city: "Miami, US",        minutes: 7  },
      { name: "Natalia C.", city: "Medellín, CO",     minutes: 9  },
      { name: "Jorge L.",   city: "Monterrey, MX",    minutes: 12 },
      { name: "Paulina O.", city: "Santiago, CL",     minutes: 14 },
      { name: "Luis F.",    city: "Buenos Aires, AR", minutes: 16 },
      { name: "Daniela K.", city: "Lima, PE",         minutes: 19 },
      { name: "Roberto M.", city: "Quito, EC",        minutes: 22 },
      { name: "Ana S.",     city: "Santo Domingo, DO",minutes: 26 },
      { name: "Iván T.",    city: "Panamá, PA",       minutes: 29 },
      { name: "Sofía V.",   city: "Barcelona, ES",    minutes: 33 },
      { name: "Julián Z.",  city: "Asunción, PY",     minutes: 38 },
      { name: "Camila H.",  city: "San José, CR",     minutes: 41 },
    ],
  },

  // ─── FOOTER ───────────────────────────────────────────────────────────────
  footer: {
    logo_1:  "Synergy",
    logo_em: " Education",
    copy:    "Sinergéticos / Synergy Education · Todos los derechos reservados 2026",
    url:     "synergyforeducation.mx",
    disclaimers: [
      "Este sitio no es parte de Meta Platforms Inc. (Facebook / Instagram) ni ha sido avalado por Meta. Facebook e Instagram son marcas registradas de Meta Platforms Inc.",
      "Este sitio no es parte de Google LLC ni ha sido avalado por Google. Google, YouTube y Ads son marcas registradas de Google LLC.",
      "Los resultados y testimonios mostrados no representan una garantía. Los resultados dependen del esfuerzo, experiencia y compromiso de cada participante.",
    ],
    links: [
      { label: "Aviso de Privacidad",    href: "/privacidad" },
      { label: "Términos y Condiciones", href: "/terminos" },
    ],
    contact: {
      email:   "hola@synergyforeducation.mx",
      company: "Synergy Education · Sinergéticos",
    },
  },
};
