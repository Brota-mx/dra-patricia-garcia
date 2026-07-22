import { defineRouting } from "next-intl/routing";

/**
 * Rutas con slugs localizados.
 *
 * La clave es el slug interno (el nombre de la carpeta en `app/[locale]/`);
 * el valor es la URL pública por idioma. `/en/servicios` rankearía mal en
 * búsqueda en inglés — por eso `/en/services`.
 *
 * Al agregar una ruta: crear la carpeta con el slug interno (español) y
 * registrar aquí su traducción.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/servicios": { es: "/servicios", en: "/services" },
    // El segmento dinámico NO se traduce solo: el slug viaja tal cual y cada
    // servicio define el suyo por idioma en content/services.ts.
    "/servicios/[slug]": {
      es: "/servicios/[slug]",
      en: "/services/[slug]",
    },
    "/sobre-mi": { es: "/sobre-mi", en: "/about" },
    "/blog": "/blog",
    // El slug de artículo, como el de servicio, viaja tal cual: cada post
    // define su slug por idioma en Sanity (schema localeSlug).
    "/blog/[slug]": "/blog/[slug]",
    "/contacto": { es: "/contacto", en: "/contact" },
    "/aviso-de-privacidad": {
      es: "/aviso-de-privacidad",
      en: "/privacy-policy",
    },
    "/design-system": "/design-system",
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

/**
 * Rutas SIN segmentos dinámicos: las que se pueden pasar como string simple a
 * `Link`, `getPathname` o al sitemap. Las dinámicas (`/servicios/[slug]`)
 * exigen `{ pathname, params }` y por eso se excluyen aquí — si no, cualquier
 * navegación aceptaría una ruta a la que le faltan los params.
 */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;
