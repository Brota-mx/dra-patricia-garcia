import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type StaticPathname } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";

/**
 * Solo se listan las rutas con contenido real. Las páginas que todavía son
 * marcador (`robots: noindex`) se agregan en su fase — un sitemap que declara
 * páginas vacías le pide a Google que indexe humo.
 *
 * TODO(Fases 9,10): agregar /blog y /aviso-de-privacidad conforme se pueblen.
 */
const publicRoutes: StaticPathname[] = [
  "/",
  "/servicios",
  "/sobre-mi",
  "/contacto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  return publicRoutes.map((href) => ({
    url: `${base}${getPathname({ href, locale: routing.defaultLocale })}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: href === "/" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${base}${getPathname({ href, locale })}`,
        ]),
      ),
    },
  }));
}
