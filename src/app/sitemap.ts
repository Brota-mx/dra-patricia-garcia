import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { getPosts } from "@/lib/sanity";
import { routing, type StaticPathname, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";

/**
 * Solo se listan las rutas con contenido real. Las páginas que todavía son
 * marcador (`robots: noindex`) se agregan en su fase — un sitemap que declara
 * páginas vacías le pide a Google que indexe humo.
 */
const publicRoutes: StaticPathname[] = [
  "/",
  "/servicios",
  "/sobre-mi",
  "/contacto",
  "/aviso-de-privacidad",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticEntries = publicRoutes.map((href) => ({
    url: `${base}${getPathname({ href, locale: routing.defaultLocale })}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    // Texto legal: casi nunca es la página de entrada, así que no compite en
    // prioridad con las páginas comerciales.
    priority: href === "/" ? 1 : href === "/aviso-de-privacidad" ? 0.3 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${base}${getPathname({ href, locale })}`,
        ]),
      ),
    },
  }));

  // Sin cuenta de Sanity configurada, getPosts() devuelve [] y el blog
  // simplemente no aparece en el sitemap — mismo principio que los servicios
  // estéticos sin divulgación: no se indexa lo que no tiene contenido real.
  const postsByLocale = await Promise.all(
    routing.locales.map((locale) => getPosts(locale)),
  );

  if (postsByLocale.every((posts) => posts.length === 0)) {
    return staticEntries;
  }

  const blogIndexEntry = {
    url: `${base}${getPathname({ href: "/blog", locale: routing.defaultLocale })}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${base}${getPathname({ href: "/blog", locale })}`,
        ]),
      ),
    },
  };

  // Un mismo artículo puede tener un slug distinto por idioma (igual que los
  // servicios); se agrupa por _id para que el hreflang apunte a la URL
  // traducida real, no a la misma ruta repetida en los dos idiomas.
  const slugsById = new Map<string, Partial<Record<Locale, string>>>();
  routing.locales.forEach((locale, i) => {
    for (const post of postsByLocale[i]) {
      const entry = slugsById.get(post._id) ?? {};
      entry[locale] = post.slug;
      slugsById.set(post._id, entry);
    }
  });

  const postEntries = Array.from(slugsById.values())
    .filter((slugs) => slugs[routing.defaultLocale])
    .map((slugs) => ({
      url: `${base}${getPathname({
        href: { pathname: "/blog/[slug]", params: { slug: slugs[routing.defaultLocale]! } },
        locale: routing.defaultLocale,
      })}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales
            .filter((locale) => slugs[locale])
            .map((locale) => [
              locale,
              `${base}${getPathname({
                href: { pathname: "/blog/[slug]", params: { slug: slugs[locale]! } },
                locale,
              })}`,
            ]),
        ),
      },
    }));

  return [...staticEntries, blogIndexEntry, ...postEntries];
}
