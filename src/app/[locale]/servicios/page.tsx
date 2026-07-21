import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { services } from "@/content/services";
import { isPublishable } from "@/types/content";
import { getPathname } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicePage" });

  return {
    title: t("indexTitle"),
    description: t("indexLead"),
    alternates: buildAlternates("/servicios", locale),
    // Ya tiene contenido real: se quita el noindex de la Fase 2.
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <h1 className="text-display">{t("servicePage.indexTitle")}</h1>
      <p className="mt-4 max-w-[58ch] text-body-lg text-muted">
        {t("servicePage.indexLead")}
      </p>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          // Sólo enlazamos al detalle si el servicio es publicable. Un
          // procedimiento estético sin su divulgación obligatoria no tiene
          // página de detalle, así que enlazar ahí sería un 404.
          const linkable = isPublishable(service);
          const href = getPathname({
            href: { pathname: "/servicios/[slug]", params: { slug: service.slug[locale] } },
            locale,
          });

          return (
            <Card key={service.id} as="li" className="flex flex-col">
              <h2 className="text-subheading">{service.name[locale]}</h2>
              <p className="mt-2 text-sm text-malva-deep">
                {service.tagline[locale]}
              </p>
              <p className="mt-4 flex-1 text-sm text-muted">
                {service.description[locale]}
              </p>
              {linkable && (
                <div className="mt-6">
                  <Button size="sm" variant="secondary" href={href}>
                    {t("common.readMore")}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </ul>
    </main>
  );
}
