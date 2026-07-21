import type { StaticPathname } from "@/i18n/routing";

/**
 * Fuente única de la navegación. El Header y el Footer leen de aquí — no
 * duplicar listas de enlaces en los componentes.
 *
 * `labelKey` apunta a `messages/{es,en}.json` → namespace `nav`.
 */
export const mainNav: Array<{ href: StaticPathname; labelKey: string }> = [
  { href: "/servicios", labelKey: "services" },
  { href: "/sobre-mi", labelKey: "about" },
  { href: "/blog", labelKey: "blog" },
  { href: "/contacto", labelKey: "contact" },
];

export const legalNav: Array<{ href: StaticPathname; labelKey: string }> = [
  { href: "/aviso-de-privacidad", labelKey: "privacy" },
];
