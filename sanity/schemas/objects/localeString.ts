import { defineField, defineType } from "sanity";

/**
 * Cadena corta bilingüe (títulos, nombres). Cada idioma es su propio campo
 * requerido — nunca un fallback silencioso a un idioma cuando falta el otro.
 * Ver BLUEPRINT.md §4: paridad de claims entre ES y EN es requisito legal,
 * no sólo de estilo.
 */
export const localeString = defineType({
  name: "localeString",
  title: "Texto (ES/EN)",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "string", validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
  ],
});
