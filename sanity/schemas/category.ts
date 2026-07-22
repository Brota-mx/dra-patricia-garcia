import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Compartido entre idiomas — ej. \"cuidado-de-la-piel\".",
      options: { source: "title.es", maxLength: 96 },
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title.es" },
  },
});
