import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { services } from "@/content/services";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ServiceCardCta } from "./ServiceCardCta";

/**
 * Rejilla de servicios destacados.
 *
 * Cada tarjeta lleva su propio CTA de WhatsApp con mensaje pre-llenado. Eso
 * quita el costo de redactar el primer mensaje —el momento de máxima fricción
 * emocional— y de paso indica qué servicio generó el contacto.
 *
 * Las tarjetas todavía NO enlazan a la página de detalle: esas rutas llegan en
 * la Fase 5. Enlazar a un 404 sería peor que no enlazar.
 */
export function ServicesGrid({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const featured = services.filter((s) => s.featured);
  const contactHref = getPathname({ href: "/contacto", locale });

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20">
      <h2 className="text-heading">{t("sections.servicesTitle")}</h2>
      <p className="mt-3 max-w-[58ch] text-muted">
        {t("sections.servicesLead")}
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((service) => (
          <Card key={service.id} as="li" className="flex flex-col">
            <h3 className="text-subheading">{service.name[locale]}</h3>
            <p className="mt-2 text-sm text-malva-deep">
              {service.tagline[locale]}
            </p>
            <p className="mt-4 flex-1 text-sm text-muted">
              {service.description[locale]}
            </p>
            <div className="mt-6">
              <ServiceCardCta
                message={service.whatsappIntent[locale]}
                serviceId={service.id}
                label={t("sections.servicesCta")}
                fallbackHref={contactHref}
              />
            </div>
          </Card>
        ))}
      </ul>
    </section>
  );
}
