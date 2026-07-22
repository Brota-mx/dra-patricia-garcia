import { defineField, defineType } from "sanity";

/**
 * Slug bilingüe: cada idioma tiene su propia URL traducida, igual que
 * `content/services.ts` en el sitio (`/es/servicios/relleno-de-labios` ↔
 * `/en/services/lip-filler`). Un slug en español bajo `/en` rankea peor.
 */
export const localeSlug = defineType({
  name: "localeSlug",
  title: "Slug (ES/EN)",
  type: "object",
  fields: [
    defineField({
      name: "es",
      title: "Español",
      type: "slug",
      options: { source: "title.es", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (r) => r.required(),
    }),
  ],
});
