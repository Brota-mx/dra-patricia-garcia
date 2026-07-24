import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { MandatoryDisclosureSection } from "@/components/sections/MandatoryDisclosure";
import { ServiceCardCta } from "@/components/sections/ServiceCardCta";
import { services, serviceBySlug } from "@/content/services";
import { isPublishable } from "@/types/content";
import { getPathname } from "@/i18n/navigation";
import { buildAlternates, siteUrl } from "@/lib/seo";
import { clinic } from "@/content/clinic";
import { serviceKeywords } from "@/content/seoKeywords";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Sólo se generan rutas para servicios PUBLICABLES.
 *
 * Un procedimiento de embellecimiento sin su divulgación obligatoria (riesgos,
 * contraindicaciones, efectos secundarios) no puede tener página pública: el
 * art. 65 fr. II y III del RLGSMP condiciona la publicidad a manifestarlos.
 * Mientras la doctora no los entregue, la URL simplemente no existe.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services
      .filter(isPublishable)
      .map((service) => ({ locale, slug: service.slug[locale] })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = serviceBySlug(slug, locale);
  if (!service) return {};

  return {
    title: service.name[locale],
    description: service.tagline[locale],
    alternates: buildAlternates("/servicios", locale),
    keywords: serviceKeywords[service.id]?.[locale],
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = serviceBySlug(slug, locale);
  if (!service || !isPublishable(service)) notFound();

  const t = await getTranslations();
  const contactHref = getPathname({ href: "/contacto", locale });

  // JSON-LD: describe el procedimiento y quién lo realiza. Pesa para E-E-A-T
  // en salud, donde Google exige señales de autoridad más duras (YMYL).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.name[locale],
    description: service.description[locale],
    url: `${siteUrl()}${getPathname({
      href: { pathname: "/servicios/[slug]", params: { slug } },
      locale,
    })}`,
    areaServed: { "@type": "City", name: clinic.city },
    provider: {
      "@type": "MedicalClinic",
      name: clinic.name,
      url: `${siteUrl()}${getPathname({ href: "/", locale })}`,
    },
  };

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="eyebrow text-malva-deep">{service.tagline[locale]}</p>
      <h1 className="mt-4 max-w-[20ch] text-display">{service.name[locale]}</h1>

      <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-subheading">{t("servicePage.whatItIs")}</h2>
          <p className="mt-4 max-w-[68ch] text-body-lg">
            {service.description[locale]}
          </p>

          <h2 className="mt-12 text-subheading">{t("servicePage.benefits")}</h2>
          <ul className="mt-4 max-w-[68ch] space-y-3">
            {service.benefits[locale].map((b) => (
              <li key={b} className="flex gap-3 text-muted">
                <span aria-hidden="true" className="text-malva-deep">
                  —
                </span>
                {b}
              </li>
            ))}
          </ul>

          {/* Duración y contenido de la sesión sólo si la doctora los entregó. */}
          {service.duration && (
            <>
              <h2 className="mt-12 text-subheading">
                {t("servicePage.duration")}
              </h2>
              <p className="mt-4 text-muted">{service.duration[locale]}</p>
            </>
          )}

          {service.includes && (
            <>
              <h2 className="mt-12 text-subheading">
                {t("servicePage.includes")}
              </h2>
              <ul className="mt-4 space-y-2">
                {service.includes[locale].map((i) => (
                  <li key={i} className="text-muted">
                    {i}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* 🔴 Va ARRIBA del CTA, visible y sin colapsar (art. 65 fr. II y III). */}
          {service.isCosmeticProcedure && (
            <MandatoryDisclosureSection
              disclosure={service.disclosure}
              locale={locale}
            />
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-card border border-line bg-surface p-6">
            <p className="font-display font-medium">{service.name[locale]}</p>
            <p className="mt-2 text-sm text-muted">
              {t("servicePage.detailsPending")}
            </p>
            <div className="mt-6">
              <ServiceCardCta
                message={service.whatsappIntent[locale]}
                serviceId={service.id}
                label={t("sections.servicesCta")}
                fallbackHref={contactHref}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="ghost"
              size="sm"
              href={getPathname({ href: "/servicios", locale })}
            >
              {t("servicePage.backToServices")}
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
