// @ts-check
/**
 * Siembra 6 artículos de blog en Sanity — reescritos a formato largo con
 * intención de búsqueda a partir de los temas que ya sostienen el resto del
 * sitio (relleno de labios, toxina botulínica, skin boosters, medicina
 * general, cuidado de la piel), no traducciones literales de un caption.
 *
 * ⚠️ No se pudo iniciar sesión en Instagram (fuera de alcance — ver
 * Estado - Patricia Garcia.md), así que este contenido es ORIGINAL escrito
 * con el mismo criterio de cumplimiento que content/services.ts, no una
 * reescritura de los captions reales de @doctorapatga. Cuando la doctora dé
 * acceso al feed, conviene revisar estos 6 contra sus posts con mejor
 * desempeño y ajustar sin perder la guardia legal de ninguno de los dos.
 *
 * Requiere `SANITY_API_WRITE_TOKEN` con permiso de escritura — nunca en
 * Vercel, sólo local y de un solo uso. Idempotente: usa IDs fijos, así que
 * correrlo dos veces actualiza en vez de duplicar.
 *
 *   node --env-file=.env.local scripts/seed-sanity.mjs
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Faltan NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_API_WRITE_TOKEN. " +
      "Corre: node --env-file=.env.local scripts/seed-sanity.mjs",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-07-01",
  token,
  useCdn: false,
});

// ── Helpers para armar Portable Text sin escribir el JSON a mano ──────────
let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;

function paragraph(text) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

function heading(text) {
  return {
    _type: "block",
    _key: key(),
    style: "h2",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

// `items` es { es: string[], en: string[] } — el mismo número de viñetas en
// ambos idiomas (paridad de claims, misma regla que content/services.ts).
function list(items) {
  return items.es.map((_, i) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key(),
        text: { es: items.es[i], en: items.en[i] },
        marks: [],
      },
    ],
  }));
}

function body(blocks) {
  return blocks.flat();
}

// ── Categorías (comparten slug entre idiomas) ──────────────────────────────
const categories = [
  {
    _id: "category-medicina-estetica",
    _type: "category",
    title: { es: "Medicina estética", en: "Aesthetic Medicine" },
    slug: { _type: "slug", current: "medicina-estetica" },
  },
  {
    _id: "category-cuidado-de-la-piel",
    _type: "category",
    title: { es: "Cuidado de la piel", en: "Skincare" },
    slug: { _type: "slug", current: "cuidado-de-la-piel" },
  },
  {
    _id: "category-medicina-general",
    _type: "category",
    title: { es: "Medicina general", en: "General Medicine" },
    slug: { _type: "slug", current: "medicina-general" },
  },
];

// ── Autora ──────────────────────────────────────────────────────────────────
const author = {
  _id: "author-patricia-garcia",
  _type: "author",
  name: "Dra. Patricia García",
  credentials: {
    es: "Médica Cirujana, Instituto Politécnico Nacional · Cédula profesional verificable en el Registro Nacional de Profesionistas",
    en: "Physician (Médica Cirujana), Instituto Politécnico Nacional · Professional license publicly verifiable in Mexico's National Registry of Professionals",
  },
  bio: {
    es: "Consulta de medicina general y medicina estética en Playa del Carmen. Toda propuesta parte de una valoración: si un procedimiento no es adecuado para ti, te lo digo.",
    en: "General and aesthetic medicine practice in Playa del Carmen. Every proposal starts with an assessment — if a procedure isn't right for you, I'll say so.",
  },
};

// ── Artículos ────────────────────────────────────────────────────────────
// Reglas de redacción (las mismas de content/services.ts): cero verbos
// terapéuticos sobre procedimientos de embellecimiento, cero marcas
// comerciales, cero promesas de resultado — se escribe sobre la APARIENCIA.
const posts = [
  {
    key: "mito-realidad-relleno-labios",
    categoryId: "category-medicina-estetica",
    title: {
      es: "Mito vs. realidad: 5 ideas equivocadas sobre el relleno de labios",
      en: "Myth vs. reality: 5 misconceptions about lip filler",
    },
    slug: { es: "mito-vs-realidad-relleno-de-labios", en: "myth-vs-reality-lip-filler" },
    excerpt: {
      es: "Aclaro 5 ideas equivocadas que escucho seguido en consulta sobre el relleno de labios con ácido hialurónico.",
      en: "Clearing up 5 misconceptions I hear often in consultation about hyaluronic acid lip filler.",
    },
    seoKeywords: {
      es: ["relleno de labios playa del carmen", "ácido hialurónico labios", "mitos relleno de labios"],
      en: ["lip filler playa del carmen", "hyaluronic acid lips", "lip filler myths"],
    },
    blocks: [
      paragraph({
        es: "En consulta escucho las mismas dudas una y otra vez sobre el relleno de labios. Algunas vienen de un post viral, otras de la experiencia de una amiga. Aquí aclaro cinco de las más comunes, sin promesas y sin dramatismo.",
        en: "In consultation I hear the same questions again and again about lip filler. Some come from a viral post, others from a friend's experience. Here I clear up five of the most common ones — no promises, no drama.",
      }),
      heading({
        es: "Mito 1: \"El resultado es igual para todas\"",
        en: 'Myth 1: "The result is the same for everyone"',
      }),
      paragraph({
        es: "Realidad: el plan se define en una valoración previa, a partir de tus rasgos y de lo que buscas. No existe una plantilla única — dos personas con la misma cantidad de producto pueden tener resultados muy distintos según su anatomía de base.",
        en: "Reality: the plan is defined in a prior consultation, based on your features and what you're looking for. There's no single template — two people with the same amount of product can end up with very different results depending on their baseline anatomy.",
      }),
      heading({
        es: "Mito 2: \"Más producto es mejor\"",
        en: 'Myth 2: "More product is better"',
      }),
      paragraph({
        es: "Realidad: un enfoque gradual permite empezar con poco y valorar antes de decidir si conviene continuar. Es una opción razonable para quien quiere ver cómo se ve el cambio antes de comprometerse a algo mayor.",
        en: "Reality: a gradual approach lets you start small and reassess before deciding whether to continue. It's a reasonable option for anyone who wants to see how the change looks before committing to something bigger.",
      }),
      heading({
        es: "Mito 3: \"Cualquiera puede hacerlo, no hace falta un médico\"",
        en: 'Myth 3: "Anyone can do it, you don\'t need a physician"',
      }),
      paragraph({
        es: "Realidad: es un procedimiento de medicina estética, y quien lo realiza debe poder identificar cuándo NO es adecuado para ti. Preguntar por la cédula profesional de quien te va a inyectar es razonable, no exagerado.",
        en: "Reality: this is an aesthetic medicine procedure, and whoever performs it needs to be able to identify when it's NOT right for you. Asking to see the professional license of whoever is going to inject you is reasonable, not excessive.",
      }),
      heading({
        es: "Mito 4: \"Si no me gusta, ya no se puede hacer nada\"",
        en: 'Myth 4: "If I don\'t like it, nothing can be done"',
      }),
      paragraph({
        es: "Realidad: por eso el enfoque gradual importa, y por eso se conversa en la valoración qué pasa si el resultado no es el esperado. Cada caso se revisa de forma individual.",
        en: "Reality: this is exactly why a gradual approach matters, and why what happens if the result isn't what you expected gets discussed during the consultation. Every case is reviewed individually.",
      }),
      heading({
        es: "Mito 5: \"No hay ningún riesgo, es súper sencillo\"",
        en: 'Myth 5: "There\'s no risk at all, it\'s super simple"',
      }),
      paragraph({
        es: "Realidad: como cualquier procedimiento médico, tiene riesgos y contraindicaciones que se revisan antes de decidir. Minimizarlos no le hace ningún favor a quien está considerando el procedimiento.",
        en: "Reality: like any medical procedure, it has risks and contraindications that are reviewed before deciding anything. Minimizing them doesn't do anyone a favor.",
      }),
    ],
  },
  {
    key: "primera-valoracion-toxina-botulinica",
    categoryId: "category-medicina-estetica",
    title: {
      es: "Toxina botulínica: qué esperar en tu primera valoración",
      en: "Botulinum toxin: what to expect at your first consultation",
    },
    slug: { es: "primera-valoracion-toxina-botulinica", en: "first-consultation-botulinum-toxin" },
    excerpt: {
      es: "Cómo es una primera valoración para toxina botulínica: qué se revisa, qué preguntas hacer y qué es razonable esperar.",
      en: "What a first consultation for botulinum toxin looks like: what gets reviewed, what to ask, and what's reasonable to expect.",
    },
    seoKeywords: {
      es: ["toxina botulínica playa del carmen", "primera cita botox", "valoración medicina estética"],
      en: ["botulinum toxin playa del carmen", "first botox appointment", "aesthetic medicine consultation"],
    },
    blocks: [
      paragraph({
        es: "Si nunca te has hecho toxina botulínica, la parte que más dudas genera no es el procedimiento en sí, sino todo lo previo. Esto es lo que pasa en una primera valoración.",
        en: "If you've never had botulinum toxin before, the part that raises the most questions isn't the procedure itself — it's everything that comes before it. Here's what happens in a first consultation.",
      }),
      heading({ es: "Se revisa tu historial, no sólo tu cara", en: "Your history gets reviewed, not just your face" }),
      paragraph({
        es: "Antes de hablar de zonas o de cantidades, se revisan antecedentes médicos, medicamentos que tomas y si hay alguna condición que lo contraindique. Es la parte menos vistosa y la más importante.",
        en: "Before talking about areas or amounts, we review your medical history, medications you're taking, and whether any condition would make the procedure inadvisable. It's the least visible part of the visit — and the most important.",
      }),
      heading({ es: "Se conversa qué es razonable esperar", en: "We talk about what's reasonable to expect" }),
      paragraph({
        es: "El efecto sobre la apariencia de las líneas de expresión dinámicas es temporal, y varía de persona a persona. Parte de la valoración es alinear expectativas: qué zonas conviene tratar en tu caso y qué no.",
        en: "The effect on the appearance of dynamic expression lines is temporary and varies from person to person. Part of the consultation is aligning expectations — which areas make sense to treat in your case, and which don't.",
      }),
      heading({ es: "Es un buen momento para hacer preguntas", en: "It's a good time to ask questions" }),
      list({
        es: [
          "¿Qué riesgos y contraindicaciones aplican a mi caso?",
          "¿Cuánto dura el efecto y qué pasa después?",
          "¿Qué cédula profesional respalda el procedimiento?",
        ],
        en: [
          "What risks and contraindications apply to my case?",
          "How long does the effect last, and what happens afterward?",
          "What professional license backs this procedure?",
        ],
      }),
      paragraph({
        es: "Si en la valoración se concluye que el procedimiento no es adecuado para ti, eso también es un resultado válido de la consulta.",
        en: "If the consultation concludes the procedure isn't right for you, that's also a valid outcome of the visit.",
      }),
    ],
  },
  {
    key: "skin-boosters-explicado",
    categoryId: "category-medicina-estetica",
    title: {
      es: "Skin boosters: hidratación con ácido hialurónico, explicado",
      en: "Skin boosters: hyaluronic acid hydration, explained",
    },
    slug: { es: "skin-boosters-hidratacion-explicado", en: "skin-boosters-explained" },
    excerpt: {
      es: "En qué se diferencia un skin booster de un relleno, y para quién tiene sentido esta opción de hidratación.",
      en: "How a skin booster differs from a filler, and who this hydration option makes sense for.",
    },
    seoKeywords: {
      es: ["skin booster playa del carmen", "hidratación ácido hialurónico", "piel luminosa"],
      en: ["skin booster playa del carmen", "hyaluronic acid hydration", "skin luminosity"],
    },
    blocks: [
      paragraph({
        es: "\"Skin booster\" es de los términos que más confusión genera, porque suena a relleno pero no busca lo mismo. Aquí la diferencia, en términos simples.",
        en: '"Skin booster" is one of the most confusing terms out there, because it sounds like filler but isn\'t aiming for the same thing. Here\'s the difference, in simple terms.',
      }),
      heading({ es: "No busca volumen — busca hidratación", en: "It's not about volume — it's about hydration" }),
      paragraph({
        es: "Un relleno tradicional busca modificar volumen y contorno. Un skin booster aplica ácido hialurónico con el objetivo de aportar hidratación, sin buscar aumento de volumen ni cambiar la forma de la zona tratada.",
        en: "A traditional filler aims to change volume and contour. A skin booster applies hyaluronic acid to provide hydration, without seeking added volume or changing the shape of the treated area.",
      }),
      heading({ es: "¿Para quién tiene sentido?", en: "Who is this for?" }),
      paragraph({
        es: "Es una opción para quien quiere mejorar la apariencia de textura y luminosidad de la piel o de los labios, sin que cambie su forma. En el clima húmedo y de alta exposición solar de la Riviera Maya, es una pregunta que surge seguido en consulta.",
        en: "It's an option for those who want to improve the appearance of skin or lip texture and luminosity, without changing their shape. In the Riviera Maya's humid, high-sun climate, this comes up often in consultation.",
      }),
      heading({ es: "Qué se revisa antes", en: "What gets reviewed beforehand" }),
      paragraph({
        es: "Como con cualquier procedimiento de medicina estética, se hace una valoración previa: qué buscas, si el procedimiento es adecuado para ti y qué riesgos implica en tu caso particular.",
        en: "As with any aesthetic medicine procedure, a prior assessment is done: what you're looking for, whether the procedure is right for you, and what risks apply in your particular case.",
      }),
    ],
  },
  {
    key: "protector-solar-mineral-riviera-maya",
    categoryId: "category-cuidado-de-la-piel",
    title: {
      es: "Protector solar mineral en la Riviera Maya: guía práctica",
      en: "Mineral sunscreen in the Riviera Maya: a practical guide",
    },
    slug: { es: "protector-solar-mineral-riviera-maya", en: "mineral-sunscreen-riviera-maya" },
    excerpt: {
      es: "Por qué el protector solar mineral importa más en Playa del Carmen, y cómo elegirlo si vas a cenotes o parques naturales.",
      en: "Why mineral sunscreen matters more in Playa del Carmen, and how to choose one for cenotes or nature parks.",
    },
    seoKeywords: {
      es: ["protector solar mineral cenotes", "cuidado de la piel playa del carmen", "protector solar clima húmedo"],
      en: ["mineral sunscreen cenotes", "skincare playa del carmen", "sunscreen humid climate"],
    },
    blocks: [
      paragraph({
        es: "Vivir o vacacionar en la Riviera Maya cambia por completo lo que conviene buscar en un protector solar. Esto es lo que reviso con pacientes que preguntan por rutina de cuidado de la piel para este clima.",
        en: "Living in — or vacationing along — the Riviera Maya completely changes what you should look for in a sunscreen. Here's what I go over with patients who ask about a skincare routine for this climate.",
      }),
      heading({ es: "Mineral, no químico, si vas a cenotes", en: "Mineral, not chemical, if you're visiting cenotes" }),
      paragraph({
        es: "Varios cenotes y parques naturales de la zona no permiten protector solar con filtros químicos, porque afectan el ecosistema del agua. Un protector solar mineral (a base de óxido de zinc o dióxido de titanio) suele ser la opción aceptada.",
        en: "Several cenotes and nature parks in the area don't allow sunscreen with chemical filters, because they affect the water's ecosystem. A mineral sunscreen (zinc oxide or titanium dioxide based) is usually the accepted option.",
      }),
      heading({ es: "El clima húmedo cambia la rutina", en: "The humid climate changes the routine" }),
      paragraph({
        es: "En un clima con alta humedad y exposición solar casi todo el año, la reaplicación importa más que la fórmula perfecta. Una textura más ligera facilita reaplicar cada dos horas sin sentir la piel cargada.",
        en: "In a climate with high humidity and near-year-round sun exposure, reapplication matters more than finding the perfect formula. A lighter texture makes it easier to reapply every two hours without your skin feeling heavy.",
      }),
      heading({ es: "Qué revisar según tu tipo de piel", en: "What to check based on your skin type" }),
      list({
        es: [
          "Etiqueta \"reef safe\" o \"biodegradable\" si vas a nadar en cenotes",
          "Textura en gel o fluida si tu piel es mixta o grasa",
          "FPS 50 o más si vas a estar varias horas al sol",
        ],
        en: [
          '"Reef safe" or "biodegradable" labeling if you\'ll be swimming in cenotes',
          "Gel or fluid texture if your skin is combination or oily",
          "SPF 50 or higher if you'll be in the sun for several hours",
        ],
      }),
      paragraph({
        es: "La recomendación puntual siempre depende de tu tipo de piel y tu rutina real — por eso vale la pena revisarlo en consulta en vez de guiarte solo por lo que le funcionó a alguien más.",
        en: "The specific recommendation always depends on your skin type and your actual routine — which is why it's worth reviewing in consultation rather than going only by what worked for someone else.",
      }),
    ],
  },
  {
    key: "cuando-ver-medico-general-turista-expat",
    categoryId: "category-medicina-general",
    title: {
      es: "Cuándo ver a un médico general en Playa del Carmen: guía para turistas y expats",
      en: "When to see a general doctor in Playa del Carmen: a guide for tourists and expats",
    },
    slug: { es: "medico-general-turistas-y-expats", en: "general-doctor-tourists-and-expats" },
    excerpt: {
      es: "Qué esperar de una consulta de medicina general en Playa del Carmen si vives fuera de México o estás de visita.",
      en: "What to expect from a general medicine consultation in Playa del Carmen if you live outside Mexico or are just visiting.",
    },
    seoKeywords: {
      es: ["médico general playa del carmen", "doctor turistas riviera maya", "consulta médica expat"],
      en: ["doctor playa del carmen", "medical care tourists riviera maya", "expat medical consultation"],
    },
    blocks: [
      paragraph({
        es: "Playa del Carmen recibe todos los días a turistas y a una comunidad grande de residentes extranjeros, y una de las dudas más comunes es simple: si algo pasa, ¿a quién ves?",
        en: "Playa del Carmen sees tourists and a large expat community every day, and one of the most common questions is simple: if something comes up, who do you see?",
      }),
      heading({ es: "No hace falta una urgencia para agendar", en: "You don't need an emergency to book a visit" }),
      paragraph({
        es: "Una consulta de medicina general sirve para valoración, seguimiento y orientación — no sólo para cuando algo ya salió mal. Si vives aquí o estás de visita y quieres una valoración de rutina, es una opción disponible.",
        en: "A general medicine consultation is for assessment, follow-up, and guidance — not only for when something has already gone wrong. If you live here or are visiting and want a routine check-up, that's an available option.",
      }),
      heading({ es: "La barrera de idioma no debería ser un obstáculo", en: "The language barrier shouldn't be an obstacle" }),
      paragraph({
        es: "Explicar un síntoma en un segundo idioma agrega estrés a algo que ya es incómodo. Poder tener la consulta en inglés facilita que la conversación sea completa, no una versión resumida por falta de vocabulario.",
        en: "Explaining a symptom in a second language adds stress to something that's already uncomfortable. Being able to have the consultation in English makes it easier for the conversation to be complete, not a shortened version due to a language gap.",
      }),
      heading({ es: "Qué llevar a tu primera cita", en: "What to bring to your first visit" }),
      list({
        es: [
          "Un resumen de medicamentos que tomas actualmente",
          "Historial médico relevante, si lo tienes a la mano",
          "Tu seguro de viaje o de gastos médicos, si aplica",
        ],
        en: [
          "A summary of medications you're currently taking",
          "Relevant medical history, if you have it handy",
          "Your travel or medical insurance information, if applicable",
        ],
      }),
    ],
  },
  {
    key: "mito-realidad-medicina-estetica",
    categoryId: "category-medicina-estetica",
    title: {
      es: "Mito vs. realidad: lo que la medicina estética no es",
      en: "Myth vs. reality: what aesthetic medicine is not",
    },
    slug: { es: "mito-vs-realidad-medicina-estetica", en: "myth-vs-reality-aesthetic-medicine" },
    excerpt: {
      es: "Aclarando algunas confusiones comunes sobre qué es y qué no es la medicina estética, antes de tu primera consulta.",
      en: "Clearing up some common confusions about what aesthetic medicine is and isn't, before your first consultation.",
    },
    seoKeywords: {
      es: ["qué es medicina estética", "medicina estética playa del carmen", "dudas medicina estética"],
      en: ["what is aesthetic medicine", "aesthetic medicine playa del carmen", "aesthetic medicine questions"],
    },
    blocks: [
      paragraph({
        es: "Antes de una primera consulta, vale la pena aclarar algunas confusiones comunes sobre qué es — y qué no es — la medicina estética.",
        en: "Before a first consultation, it's worth clearing up some common confusions about what aesthetic medicine is — and isn't.",
      }),
      heading({ es: "No es un cambio de identidad", en: "It's not about changing who you are" }),
      paragraph({
        es: "El objetivo no es que te veas como otra persona, sino trabajar sobre la apariencia de algo puntual que te interesa — y sólo si es adecuado para ti. Si no lo es, se conversa abiertamente en la valoración.",
        en: "The goal isn't to make you look like someone else — it's to work on the appearance of a specific thing you're interested in, and only if it's right for you. If it isn't, that gets discussed openly in the consultation.",
      }),
      heading({ es: "No es un procedimiento sin consecuencias", en: "It's not a consequence-free procedure" }),
      paragraph({
        es: "Como cualquier procedimiento médico, implica riesgos y contraindicaciones que se revisan antes de decidir. Cualquier información que los minimice merece desconfianza.",
        en: "Like any medical procedure, it involves risks and contraindications that are reviewed before deciding. Any information that downplays them deserves some skepticism.",
      }),
      heading({ es: "No es sólo estética — también es criterio médico", en: "It's not just aesthetics — it's medical judgment too" }),
      paragraph({
        es: "Parte del trabajo es decir que no cuando corresponde: si un procedimiento no es adecuado para ti, o si no lo necesitas, esa también es información útil de la consulta.",
        en: "Part of the work is saying no when appropriate: if a procedure isn't right for you, or if you don't need it, that's also useful information from the consultation.",
      }),
    ],
  },
];

async function seed() {
  console.log(`Sembrando en ${projectId}/${dataset}…`);

  for (const c of categories) {
    await client.createOrReplace(c);
    console.log(`  categoría: ${c.slug.current}`);
  }

  await client.createOrReplace(author);
  console.log(`  autor: ${author.name}`);

  for (const p of posts) {
    const doc = {
      _id: `post-${p.key}`,
      _type: "post",
      title: p.title,
      slug: {
        es: { _type: "slug", current: p.slug.es },
        en: { _type: "slug", current: p.slug.en },
      },
      excerpt: p.excerpt,
      // coverImage queda pendiente: requiere subir el asset real con
      // client.assets.upload() — no se puede referenciar una imagen sin
      // subirla primero. Ver TODO(cliente) en BUILD-NOTES.md §Fase 9.
      body: {
        es: body(p.blocks.map((b) => (Array.isArray(b) ? b.map((x) => localize(x, "es")) : localize(b, "es")))),
        en: body(p.blocks.map((b) => (Array.isArray(b) ? b.map((x) => localize(x, "en")) : localize(b, "en")))),
      },
      category: { _type: "reference", _ref: p.categoryId },
      author: { _type: "reference", _ref: author._id },
      publishedAt: new Date().toISOString(),
      // Bug corregido en la Fase 11: antes se escribía sólo `seoKeywords.es`
      // para los dos idiomas porque el campo en Sanity era un array plano, no
      // localizado. Con `localeStringList` cada idioma queda separado.
      seoKeywords: p.seoKeywords,
      medicalDisclaimer: true,
    };
    await client.createOrReplace(doc);
    console.log(`  artículo: ${p.slug.es}`);
  }

  console.log("Listo. Falta subir coverImage por artículo desde /studio.");
}

// Los bloques se definieron con `children[0].text` como objeto {es, en}; esto
// lo resuelve al string del idioma correspondiente antes de enviarlo.
function localize(blockOrLocalized, locale) {
  if (blockOrLocalized._type !== "block") return blockOrLocalized;
  return {
    ...blockOrLocalized,
    children: blockOrLocalized.children.map((c) => ({
      ...c,
      text: typeof c.text === "object" ? c.text[locale] : c.text,
    })),
  };
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
