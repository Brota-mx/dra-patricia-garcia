import type { Service } from "@/types/content";

/**
 * Servicios del consultorio.
 *
 * ═══ REGLAS DE REDACCIÓN (no son estilo, son cumplimiento) ═══
 *
 * 1. ⛔ CERO VERBOS TERAPÉUTICOS. El art. 63 último párrafo del RLGSMP prohíbe
 *    atribuir a procedimientos de embellecimiento cualidades "preventivas,
 *    rehabilitatorias o terapéuticas". Fuera: tratar, curar, prevenir,
 *    rejuvenecer, regenerar, reparar, restaurar, sanar, "antiedad", "detox".
 *    La sustitución: no actuamos sobre la condición, sino sobre LA APARIENCIA
 *    de la condición. "reduce las arrugas" → "suaviza la apariencia de las
 *    líneas de expresión".
 *
 * 2. ⛔ CERO MARCAS de medicamento o dispositivo (Botox®, Juvederm, Dysport…).
 *    Se describe el SERVICIO, no el producto.
 *
 * 3. ⛔ CERO promesas de resultado, superlativos, comparaciones con otros
 *    profesionales, o minimización de riesgos ("sin dolor", "sin riesgos").
 *
 * 4. ✅ Nombres en inglés = término de MERCADO, no traducción literal.
 *    "diseño de labios" → "lip filler" (nunca "lip design").
 *
 * 5. 🔴 Los procedimientos estéticos NO son publicables hasta que `disclosure`
 *    esté completa (riesgos, contraindicaciones, efectos secundarios).
 *    Usar `isPublishable()` como guardia. Es requisito del art. 65 fr. II y III.
 *
 * Detalle y fundamento: docs/investigacion/compliance-publicidad.md
 */

const emptyDisclosure = {
  risks: null,
  contraindications: null,
  sideEffects: null,
};

export const services: Service[] = [
  {
    id: "lip-filler",
    // "diseño de labios" es lenguaje de clínica: casi nadie lo busca.
    // El término real de búsqueda es "relleno de labios".
    slug: { es: "relleno-de-labios", en: "lip-filler" },
    isCosmeticProcedure: true,
    name: { es: "Relleno de labios", en: "Lip Filler" },
    tagline: {
      es: "Ácido hialurónico con enfoque en proporción natural",
      en: "Hyaluronic acid, with a focus on natural proportion",
    },
    description: {
      es: "Procedimiento ambulatorio de medicina estética en el que se aplica ácido hialurónico de grado médico para modificar el volumen y el contorno de los labios. El plan se define en una valoración previa, a partir de tus rasgos y de lo que buscas. Si el procedimiento no es adecuado para ti, te lo digo.",
      en: "An outpatient aesthetic medicine procedure using medical-grade hyaluronic acid to modify lip volume and contour. The plan is defined in a prior consultation, based on your features and what you're looking for. If the procedure isn't right for you, I'll tell you.",
    },
    benefits: {
      // Todo redactado sobre la APARIENCIA, nunca sobre una condición.
      es: [
        "Modifica la apariencia del volumen y contorno labial",
        "Permite un enfoque gradual: empezar con poco y valorar",
        "El plan se ajusta a tus rasgos, no a un modelo único",
      ],
      en: [
        "Modifies the appearance of lip volume and contour",
        "Allows a gradual approach: start small and reassess",
        "The plan follows your features, not a single template",
      ],
    },
    disclosure: emptyDisclosure,
    duration: null,
    includes: null,
    faq: [],
    whatsappIntent: {
      es: "¡Hola doctora! Vi su sitio y me interesa el relleno de labios. ¿Podría darme informes?",
      en: "Hi! I saw your website and I'm interested in lip filler. Could you tell me more?",
    },
    featured: true,
  },

  {
    id: "botulinum-toxin",
    slug: { es: "toxina-botulinica", en: "botulinum-toxin" },
    isCosmeticProcedure: true,
    // 🟠 DECISIÓN PENDIENTE DE VALIDACIÓN LEGAL — ver docs/investigacion/
    //    compliance-publicidad.md §G. Se usa el nombre genérico del
    //    procedimiento, NUNCA una marca comercial. Existe un criterio
    //    restrictivo (LGS art. 310) según el cual publicitar a población
    //    general un medicamento de prescripción no está permitido. Si el
    //    abogado confirma ese criterio, hay que renombrar el servicio a
    //    "neuromodulador para líneas de expresión" y cambiar los slugs.
    name: { es: "Toxina botulínica", en: "Botulinum Toxin" },
    tagline: {
      es: "Para la apariencia de las líneas de expresión",
      en: "For the appearance of expression lines",
    },
    description: {
      es: "Procedimiento ambulatorio en el que se aplica toxina botulínica para suavizar la apariencia de las líneas de expresión dinámicas. El efecto es temporal. En la valoración revisamos si es adecuado para ti, qué zonas conviene tratar y qué es razonable esperar en tu caso.",
      en: "An outpatient procedure using botulinum toxin to soften the appearance of dynamic expression lines. The effect is temporary. During your consultation we review whether it's appropriate for you, which areas make sense, and what is reasonable to expect in your case.",
    },
    benefits: {
      es: [
        "Suaviza la apariencia de las líneas de expresión dinámicas",
        "Procedimiento ambulatorio, sin incapacidad",
        "El efecto es temporal y se planea de forma individual",
      ],
      en: [
        "Softens the appearance of dynamic expression lines",
        "Outpatient procedure, no time off required",
        "The effect is temporary and planned individually",
      ],
    },
    disclosure: emptyDisclosure,
    duration: null,
    includes: null,
    faq: [],
    whatsappIntent: {
      es: "¡Hola doctora! Vi su sitio y quisiera informes sobre toxina botulínica.",
      en: "Hi! I saw your website and I'd like information about botulinum toxin.",
    },
    featured: true,
  },

  {
    id: "skin-booster",
    slug: { es: "hidratacion-con-acido-hialuronico", en: "skin-booster" },
    isCosmeticProcedure: true,
    name: {
      es: "Hidratación con ácido hialurónico",
      en: "Skin Booster",
    },
    tagline: {
      es: "Hidratación sin buscar volumen",
      en: "Hydration without adding volume",
    },
    description: {
      es: "Aplicación de ácido hialurónico inyectable con el objetivo de aportar hidratación, sin buscar aumento de volumen. Es una opción para quien quiere mejorar la apariencia de textura y luminosidad de la piel o de los labios sin que cambie su forma.",
      en: "Injectable hyaluronic acid applied to provide hydration, without seeking added volume. An option for those who want to improve the appearance of skin or lip texture and luminosity without changing their shape.",
    },
    benefits: {
      es: [
        "Aporta hidratación a la zona tratada",
        "No busca modificar el volumen ni la forma",
        "Mejora la apariencia de textura y luminosidad",
      ],
      en: [
        "Provides hydration to the treated area",
        "Does not aim to change volume or shape",
        "Improves the appearance of texture and luminosity",
      ],
    },
    disclosure: emptyDisclosure,
    duration: null,
    includes: null,
    faq: [],
    whatsappIntent: {
      es: "¡Hola doctora! Me interesa la hidratación con ácido hialurónico. ¿Me podría dar informes?",
      en: "Hi! I'm interested in skin boosters. Could you tell me more?",
    },
    featured: true,
  },

  {
    id: "general-medicine",
    slug: { es: "medicina-general", en: "general-medicine" },
    // No es embellecimiento: es servicio de salud. Otro régimen publicitario
    // (aviso, no permiso) y sin la divulgación del art. 65.
    isCosmeticProcedure: false,
    name: {
      es: "Consulta de medicina general",
      en: "General Medicine Consultation",
    },
    tagline: {
      es: "Valoración médica en Playa del Carmen",
      en: "Medical consultation in Playa del Carmen — in English or Spanish",
    },
    description: {
      es: "Consulta de medicina general para valoración, seguimiento y orientación médica. Si vives en Playa del Carmen o estás de visita y necesitas ver a un médico, puedes agendar una consulta.",
      en: "A general medicine consultation for assessment, follow-up and medical guidance. If you live in Playa del Carmen or are visiting and need to see a doctor, you can book a consultation.",
    },
    benefits: {
      es: [
        "Valoración médica presencial",
        "Consulta con médica cirujana con cédula profesional",
        "Atención en español",
      ],
      en: [
        "In-person medical assessment",
        "Seen by a licensed physician, not a technician",
        "Consultation available in English",
      ],
    },
    disclosure: emptyDisclosure,
    duration: null,
    includes: null,
    faq: [],
    whatsappIntent: {
      es: "¡Hola doctora! Quisiera agendar una consulta de medicina general.",
      en: "Hi! I'd like to book a general medicine consultation.",
    },
    featured: true,
  },

  {
    id: "skincare",
    slug: { es: "cuidado-de-la-piel", en: "medical-grade-skincare" },
    isCosmeticProcedure: false,
    name: {
      es: "Asesoría en cuidado de la piel",
      // "dermocosmetics" es término europeo/latinoamericano: en EE.UU. y
      // Canadá prácticamente no se busca. El término de mercado es este.
      en: "Medical-Grade Skincare",
    },
    tagline: {
      es: "Protección solar mineral y rutina para el clima del Caribe",
      en: "Mineral sun protection and skincare for the Caribbean climate",
    },
    description: {
      es: "Asesoría para elegir productos de cuidado de la piel adecuados al clima húmedo y de alta exposición solar de la Riviera Maya, incluida protección solar mineral apta para cenotes y parques que no permiten filtros químicos.",
      en: "Guidance on choosing skincare suited to the Riviera Maya's humid, high-sun climate — including mineral sun protection accepted at cenotes and parks that don't allow chemical filters.",
    },
    benefits: {
      es: [
        "Recomendación según tu tipo de piel y tu rutina real",
        "Protección solar mineral, sin filtros químicos",
        "Orientación sobre el uso en clima húmedo y alta exposición solar",
      ],
      en: [
        "Recommendations based on your skin type and actual routine",
        "Mineral sun protection, free of chemical filters",
        "Guidance for humid, high-sun conditions",
      ],
    },
    disclosure: emptyDisclosure,
    duration: null,
    includes: null,
    faq: [],
    whatsappIntent: {
      es: "¡Hola doctora! Me interesa asesoría sobre cuidado de la piel y protector solar.",
      en: "Hi! I'd like advice on skincare and sunscreen.",
    },
    featured: false,
  },
];

/** Busca un servicio por su slug en un idioma dado. */
export function serviceBySlug(slug: string, locale: "es" | "en") {
  return services.find((s) => s.slug[locale] === slug);
}
