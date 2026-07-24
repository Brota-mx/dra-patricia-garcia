import type { Localized } from "@/types/content";

/**
 * Keywords locales para `metadata.keywords`. No son afirmaciones sobre el
 * sitio ni copy publicitario — son términos de intención de búsqueda real en
 * Playa del Carmen, en los dos idiomas.
 *
 * ⚠️ Misma disciplina de nomenclatura que `content/services.ts`: nunca la
 * marca comercial de un medicamento (Botox®, Juvederm…), siempre el nombre
 * genérico del procedimiento. La duda de nomenclatura de la toxina botulínica
 * sigue sin resolver con el abogado (ver Plan - Patricia Garcia.md §🟠) —
 * meter la marca aquí sería introducir el mismo riesgo que ese pendiente
 * legal ya señaló, sólo que en metadata en vez de en el copy visible.
 *
 * Tampoco traducción literal: "relleno de labios" no es "lip design" sino
 * "lip filler" — el mismo criterio de `services.ts` para nombres de mercado.
 */
export const seoKeywords = {
  home: {
    es: [
      "medicina estética Playa del Carmen",
      "médico general Playa del Carmen",
      "toxina botulínica Playa del Carmen",
      "relleno de labios Playa del Carmen",
      "consultorio médico Playa del Carmen",
    ],
    en: [
      "aesthetic medicine Playa del Carmen",
      "general doctor Playa del Carmen",
      "botulinum toxin Playa del Carmen",
      "lip filler Playa del Carmen",
      "medical clinic Riviera Maya",
    ],
  },
  services: {
    es: [
      "servicios de medicina estética Playa del Carmen",
      "procedimientos estéticos Quintana Roo",
      "medicina general Playa del Carmen",
    ],
    en: [
      "aesthetic medicine services Playa del Carmen",
      "cosmetic procedures Quintana Roo",
      "general medicine Playa del Carmen",
    ],
  },
  about: {
    es: ["médica cirujana Playa del Carmen", "médico certificado Playa del Carmen"],
    en: ["physician Playa del Carmen", "verified doctor Playa del Carmen"],
  },
  contact: {
    es: [
      "agendar cita médica Playa del Carmen",
      "consulta medicina estética Playa del Carmen",
    ],
    en: [
      "book medical appointment Playa del Carmen",
      "aesthetic medicine consultation Playa del Carmen",
    ],
  },
  blog: {
    es: [
      "blog medicina estética",
      "cuidado de la piel Playa del Carmen",
      "consejos medicina general",
    ],
    en: ["aesthetic medicine blog", "skincare Playa del Carmen", "general medicine tips"],
  },
} satisfies Record<string, Localized<string[]>>;

/** Keywords por servicio, sólo para procedimientos que ya tienen página publicable. */
export const serviceKeywords: Record<string, Localized<string[]>> = {
  "lip-filler": {
    es: ["relleno de labios Playa del Carmen", "ácido hialurónico labios"],
    en: ["lip filler Playa del Carmen", "hyaluronic acid lips"],
  },
  "botulinum-toxin": {
    es: ["toxina botulínica Playa del Carmen", "líneas de expresión tratamiento"],
    en: ["botulinum toxin Playa del Carmen", "expression lines treatment"],
  },
  "skin-booster": {
    es: ["hidratación con ácido hialurónico", "skinbooster Playa del Carmen"],
    en: ["skin booster Playa del Carmen", "hyaluronic acid skin hydration"],
  },
  "general-medicine": {
    es: ["médico general Playa del Carmen", "consulta médica Playa del Carmen"],
    en: ["general doctor Playa del Carmen", "medical consultation Playa del Carmen"],
  },
  skincare: {
    es: ["protector solar mineral Playa del Carmen", "cuidado de la piel Riviera Maya"],
    en: ["mineral sunscreen Playa del Carmen", "skincare Riviera Maya"],
  },
};
