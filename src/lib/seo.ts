import { getPathname } from "@/i18n/navigation";
import { routing, type StaticPathname, type Locale } from "@/i18n/routing";
import { clinic } from "@/content/clinic";
import { practitioner } from "@/content/practitioner";

/** schema.org exige el día como IRI de su propia enumeración, no texto libre. */
const SCHEMA_WEEKDAY = [
  "https://schema.org/Sunday",
  "https://schema.org/Monday",
  "https://schema.org/Tuesday",
  "https://schema.org/Wednesday",
  "https://schema.org/Thursday",
  "https://schema.org/Friday",
  "https://schema.org/Saturday",
] as const;

/**
 * Construye `alternates` (canonical + hreflang) para una ruta.
 *
 * Con slugs localizados, el hreflang debe apuntar a la URL traducida real
 * (/en/services, no /en/servicios) o Google no empareja las versiones.
 * `x-default` apunta al idioma por defecto.
 */
export function buildAlternates(href: StaticPathname, locale: Locale) {
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

/**
 * JSON-LD `MedicalClinic` (subtipo de `LocalBusiness`) para el consultorio
 * como entidad — distinto del `Physician` de `/sobre-mi`, que describe a la
 * persona. Google construye el grafo de entidades de salud (YMYL) a partir de
 * ambos. Cada campo con datos aún pendientes del cliente (`clinic.address`,
 * `clinic.geo`, `clinic.hours`) se omite por completo — nunca se rellena con
 * un valor plausible. Ver BLUEPRINT.md §17.
 */
export function localBusinessJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    name: clinic.name,
    url: `${siteUrl()}${getPathname({ href: "/", locale })}`,
    description: clinic.specialty[locale],
    medicalSpecialty: ["PrimaryCare", "PlasticSurgery"],
    address: {
      "@type": "PostalAddress",
      addressLocality: clinic.city,
      addressRegion: clinic.state,
      addressCountry: clinic.country,
      ...(clinic.address && {
        streetAddress: clinic.address.street,
        postalCode: clinic.address.postalCode,
      }),
    },
    ...(clinic.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: clinic.geo.lat,
        longitude: clinic.geo.lng,
      },
    }),
    ...(clinic.whatsapp && { telephone: `+${clinic.whatsapp}` }),
    ...(clinic.hours && {
      openingHoursSpecification: clinic.hours.map((slot) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: slot.days.map((d) => SCHEMA_WEEKDAY[d]),
        opens: slot.opens,
        closes: slot.closes,
      })),
    }),
    sameAs: [clinic.instagram],
    employee: {
      "@type": "Physician",
      name: practitioner.name,
      url: `${siteUrl()}${getPathname({ href: "/sobre-mi", locale })}`,
    },
  };
}
