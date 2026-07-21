import type { Locale } from "@/i18n/routing";

/**
 * Texto disponible en los dos idiomas. Obliga a que nada quede sin traducir:
 * si falta una locale, TypeScript falla en build.
 */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Dato que sólo puede venir de la doctora (duraciones, indicaciones,
 * qué incluye un procedimiento, precios).
 *
 * `null` significa "todavía no lo tenemos", NO "no aplica". La UI debe omitir
 * el campo cuando es null — nunca rellenarlo con un valor plausible.
 * Ver BLUEPRINT.md §16 regla 2 y §17.
 */
export type PendingFromClinician<T> = T | null;

export type ServiceFaq = {
  question: Localized;
  answer: PendingFromClinician<Localized>;
};

/**
 * 🔴 DIVULGACIÓN LEGALMENTE OBLIGATORIA para procedimientos de embellecimiento.
 *
 * El art. 65 fracciones II y III del Reglamento de la LGS en Materia de
 * Publicidad condiciona la autorización de publicidad a que se "manifiesten
 * los riesgos" y se señalen "de manera clara las contraindicaciones y efectos
 * secundarios".
 *
 * Por eso este campo NO es opcional en el tipo: es un requisito de arquitectura
 * de información, no un disclaimer. Debe renderizarse VISIBLE — no dentro de un
 * modal, no en un acordeón colapsado por defecto, no en gris de 10px.
 *
 * El contenido es 100% clínico: lo redacta la doctora. Mientras esté en `null`,
 * el servicio NO debe publicarse.
 */
export type MandatoryDisclosure = {
  risks: PendingFromClinician<Localized<string[]>>;
  contraindications: PendingFromClinician<Localized<string[]>>;
  sideEffects: PendingFromClinician<Localized<string[]>>;
};

export type Service = {
  /** Clave estable para referirse al servicio en código. Nunca cambia. */
  id: string;
  /**
   * Slug POR IDIOMA — la URL pública también se traduce.
   * `/es/servicios/relleno-de-labios` ↔ `/en/services/lip-filler`.
   * El slug es señal de relevancia: un slug en español bajo /en no rankea.
   */
  slug: Localized;
  /**
   * `true` si es un procedimiento de embellecimiento (art. 63 RLGSMP).
   * Determina dos cosas: que aplica el régimen publicitario estricto
   * (permiso, no aviso) y que la divulgación obligatoria es exigible.
   */
  isCosmeticProcedure: boolean;
  /** Nombre comercial por idioma. En inglés, término de MERCADO, no literal. */
  name: Localized;
  /** Frase corta de apoyo. Sin promesas de resultado. */
  tagline: Localized;
  /** Qué es y para quién. Sin verbos terapéuticos. */
  description: Localized;
  /**
   * Qué busca el procedimiento, en lenguaje de paciente.
   * ⚠️ Redactar siempre sobre la APARIENCIA, nunca sobre la condición:
   * "suaviza la apariencia de las líneas" — no "reduce las arrugas".
   */
  benefits: Localized<string[]>;
  /** Divulgación obligatoria. Requerida si `isCosmeticProcedure`. */
  disclosure: MandatoryDisclosure;
  /** Duración de la sesión — TODO(cliente). */
  duration: PendingFromClinician<Localized>;
  /** Qué incluye la sesión — TODO(cliente). */
  includes: PendingFromClinician<Localized<string[]>>;
  /** Preguntas específicas del servicio. */
  faq: ServiceFaq[];
  /** Mensaje pre-llenado del deep link de WhatsApp, por idioma. */
  whatsappIntent: Localized;
  /** Se muestra en la rejilla de la home. */
  featured: boolean;
};

export type FaqItem = {
  question: Localized;
  answer: PendingFromClinician<Localized>;
  /** Agrupa las FAQ en la UI. */
  topic: "general" | "safety" | "booking" | "aftercare" | "international";
};

/**
 * Un procedimiento estético sólo es publicable cuando su divulgación
 * obligatoria está completa. Úsalo como guardia antes de renderizar o de
 * incluir la ruta en el sitemap.
 */
export function isPublishable(service: Service): boolean {
  if (!service.isCosmeticProcedure) return true;
  const { risks, contraindications, sideEffects } = service.disclosure;
  return risks !== null && contraindications !== null && sideEffects !== null;
}
