import { defineField, defineType } from "sanity";

/**
 * Artículo del blog.
 *
 * Paridad ES/EN es obligatoria en cada campo visible — igual que en
 * `content/services.ts` — porque ambas versiones son publicidad de un
 * servicio de salud y deben sostener el mismo claim. `medicalDisclaimer` nace
 * en `true`: el aviso "esto no sustituye una consulta" se agrega automático
 * en la plantilla del artículo (BLUEPRINT.md §8.3); desactivarlo es
 * intencional, no el default.
 */
export const post = defineType({
  name: "post",
  title: "Artículo",
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
      type: "localeSlug",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extracto",
      description: "≤160 caracteres — alimenta la meta description.",
      type: "localeText",
      validation: (r) =>
        r.required().custom((value: { es?: string; en?: string } | undefined) => {
          if (!value) return true;
          if (value.es && value.es.length > 160) return "Español supera 160 caracteres";
          if (value.en && value.en.length > 160) return "English supera 160 caracteres";
          return true;
        }),
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "localeString",
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Cuerpo",
      type: "localeBlockContent",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publicado el",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "seoKeywords",
      title: "Palabras clave (SEO)",
      description:
        "Opcional. Cada idioma es independiente — no se traduce automático, porque un término de búsqueda real en inglés casi nunca es la traducción literal del español.",
      type: "localeStringList",
    }),
    defineField({
      name: "medicalDisclaimer",
      title: "Mostrar aviso médico",
      description:
        "Aviso obligatorio en contenido de salud (BLUEPRINT.md §8.3). Apagar sólo para artículos que genuinamente no son de salud.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Fecha de publicación, recientes primero",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title.es", media: "coverImage", subtitle: "publishedAt" },
  },
});
