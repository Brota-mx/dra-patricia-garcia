import { defineField, defineType } from "sanity";

/**
 * Autor del blog. Por defecto la doctora, pero como documento propio deja
 * espacio a un coautor invitado sin remodelar el schema del post.
 *
 * `credentials` es el campo que alimenta el E-E-A-T del artículo — el mismo
 * principio que sostiene toda la página /sobre-mi: Google trata contenido de
 * salud como YMYL y exige poder atribuir cada artículo a alguien verificable.
 */
export const author = defineType({
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "credentials",
      title: "Credenciales",
      description:
        "Ej. \"Médica Cirujana, IPN · Cédula profesional verificable\". Nunca \"especialista en X\" sin cédula de especialidad — ver práctica en src/content/practitioner.ts.",
      type: "localeText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "photo",
      title: "Fotografía",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "localeText",
    }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
