import { defineField, defineType } from "sanity";

/**
 * Lista de cadenas cortas bilingüe (palabras clave SEO). A diferencia de
 * `localeString`/`localeText`, ninguno de los dos idiomas es requerido: es
 * metadata opcional (BLUEPRINT.md §4), y un artículo puede publicarse sin ella.
 */
export const localeStringList = defineType({
  name: "localeStringList",
  title: "Lista de texto (ES/EN)",
  type: "object",
  fields: [
    defineField({
      name: "es",
      title: "Español",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
