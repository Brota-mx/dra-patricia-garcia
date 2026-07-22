import { defineField, defineType } from "sanity";

/** Texto largo bilingüe de una sola línea lógica (extracto, biografía corta). */
export const localeText = defineType({
  name: "localeText",
  title: "Texto largo (ES/EN)",
  type: "object",
  fields: [
    defineField({
      name: "es",
      title: "Español",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
});
