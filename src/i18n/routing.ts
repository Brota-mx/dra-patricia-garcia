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
    "/sobre-mi": { es: "/sobre-mi", en: "/about" },
    "/blog": "/blog",
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
