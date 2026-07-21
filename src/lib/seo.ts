import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname, type Locale } from "@/i18n/routing";

/**
 * Construye `alternates` (canonical + hreflang) para una ruta.
 *
 * Con slugs localizados, el hreflang debe apuntar a la URL traducida real
 * (/en/services, no /en/servicios) o Google no empareja las versiones.
 * `x-default` apunta al idioma por defecto.
 */
export function buildAlternates(href: AppPathname, locale: Locale) {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href, locale: l })]),
  );

  return {
    canonical: getPathname({ href, locale }),
    languages: {
      ...languages,
      "x-default": getPathname({ href, locale: routing.defaultLocale }),
    },
  };
}

/** URL absoluta del sitio; cae a localhost en desarrollo. */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
