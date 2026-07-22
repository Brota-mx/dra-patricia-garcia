import { defineField, defineType, defineArrayMember } from "sanity";

/**
 * Cuerpo de artículo en Portable Text, bilingüe.
 *
 * Estilos y marcas deliberadamente acotados: nada de H1 (el título del post ya
 * es el H1 de la página), nada de color/resaltado libre que pudiera usarse
 * para simular una promesa de resultado o un superlativo — el copy médico de
 * este sitio pasa por revisión de cumplimiento, no por libertad tipográfica.
 */
const blockContent = {
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Cita", value: "blockquote" },
      ],
      lists: [
        { title: "Viñetas", value: "bullet" },
        { title: "Numerada", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Negrita", value: "strong" },
          { title: "Cursiva", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Enlace",
            fields: [
              defineField({
                name: "href",
                type: "url",
                validation: (r) =>
                  r.uri({ scheme: ["http", "https"] }).required(),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          description: "Obligatorio por accesibilidad.",
          validation: (r) => r.required(),
        }),
      ],
    }),
  ],
};

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Cuerpo (ES/EN)",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", ...blockContent }),
    defineField({ name: "en", title: "English", ...blockContent }),
  ],
});
