import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { practitioner } from "@/content/practitioner";
import { clinic } from "@/content/clinic";
import { getPathname } from "@/i18n/navigation";
import { buildAlternates, siteUrl } from "@/lib/seo";
import { seoKeywords } from "@/content/seoKeywords";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("eyebrow"),
    description: t("lead"),
    alternates: buildAlternates("/sobre-mi", locale),
    keywords: seoKeywords.about[locale],
    // Se quita el noindex de la Fase 2: ya tiene contenido real. Es la página
    // que más pesa para E-E-A-T en salud, así que debe indexarse.
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  /**
   * JSON-LD `Physician`. En YMYL, Google construye una entidad a partir de
   * estas señales; `sameAs` conecta el sitio con los perfiles existentes.
   * Sólo se declara lo que realmente tenemos — nada de campos inventados.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: practitioner.name,
    url: `${siteUrl()}${getPathname({ href: "/sobre-mi", locale })}`,
    alumniOf: { "@type": "CollegeOrUniversity", name: practitioner.school },
    medicalSpecialty: ["PrimaryCare", "PlasticSurgery"],
    areaServed: { "@type": "City", name: clinic.city },
    sameAs: [practitioner.instagram],
    // Conecta esta entidad con el `MedicalClinic` de la home (Fase 11): la
    // misma persona, descrita como empleado en un JSON-LD y como profesional
    // en el otro — construye el grafo en vez de dos entidades sueltas.
    worksFor: {
      "@type": "MedicalClinic",
      name: clinic.name,
      url: `${siteUrl()}${getPathname({ href: "/", locale })}`,
    },
    ...(practitioner.license && { identifier: practitioner.license }),
  };

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="eyebrow text-malva-deep">{t("about.eyebrow")}</p>
      <h1 className="mt-4 max-w-[20ch] text-display">{t("about.title")}</h1>
      <p className="mt-6 max-w-[58ch] text-body-lg text-muted">
        {t("about.lead")}
      </p>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Credenciales verificables */}
          <h2 className="text-subheading">{t("about.credentialsTitle")}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge>{practitioner.title[locale]}</Badge>
            <Badge>{practitioner.school}</Badge>
            <Badge tone="accent">
              {t("credentials.cofeprisLabel")} {clinic.cofepris}
            </Badge>
            {/* TODO(cliente): cédula. Aparece sola cuando llegue el dato. */}
            {practitioner.license && (
              <Badge tone="accent">Cédula {practitioner.license}</Badge>
            )}
          </div>

          {/*
            El enlace de verificación es de las señales de confianza más
            baratas y fuertes que existen, y casi ningún competidor local lo
            usa. Se muestra sólo cuando hay cédula que verificar.
          */}
          {practitioner.license ? (
            <p className="mt-6 max-w-[62ch] text-muted">
              {t("about.verifyNote")}{" "}
              <a
                href={practitioner.licenseRegistryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-malva-deep underline underline-offset-4"
              >
                {t("about.verifyLicense")}
              </a>
            </p>
          ) : (
            <p className="mt-6 text-sm text-muted">
              {t("about.pendingLicense")}
            </p>
          )}

          {/* TODO(cliente): diplomados con institución y año (art. 19 RLGSMP). */}
          {practitioner.training && (
            <>
              <h2 className="mt-14 text-subheading">
                {t("about.trainingTitle")}
              </h2>
              <ul className="mt-6 space-y-4">
                {practitioner.training.map((item) => (
                  <li key={item.name[locale]}>
                    <p className="font-medium">{item.name[locale]}</p>
                    <p className="text-sm text-muted">
                      {item.institution} · {item.year}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Filosofía de práctica — el posicionamiento del sitio */}
          <h2 className="mt-14 text-subheading">{t("about.approachTitle")}</h2>
          <p className="mt-6 max-w-[62ch] text-body-lg">
            {t("about.approachBody")}
          </p>

          {/*
            Bloque específico para el paciente extranjero. NO es traducción del
            español: el lector de EE.UU. o Canadá no puede mapear la cédula
            mexicana a "board-certified", y esa incertidumbre genera
            desconfianza por defecto, no por sospecha. Hay que explicarlo.
          */}
          <h2 className="mt-14 text-subheading">
            {t("about.internationalTitle")}
          </h2>
          <p className="mt-6 max-w-[62ch] text-muted">
            {t("about.internationalBody")}
          </p>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Card>
            {/*
              TODO(cliente): retrato profesional real. En Pagaza, la ausencia
              del retrato del socio fue la fuga de conversión #1 — el 92% de los
              pacientes lee la bio del proveedor antes de agendar. Mientras no
              llegue, se declara el hueco en vez de rellenarlo con stock.
            */}
            {practitioner.portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={practitioner.portrait.src}
                alt={practitioner.portrait.alt[locale]}
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg border border-dashed border-line bg-bone">
                <p className="px-6 text-center text-sm text-muted">
                  {t("about.pendingPortrait")}
                </p>
              </div>
            )}

            <p className="mt-6 font-display text-title font-medium">
              {practitioner.name}
            </p>
            <p className="mt-1 text-sm text-muted">
              {practitioner.title[locale]} · {clinic.city}
            </p>

            <div className="mt-6">
              <BookingCTA
                message={t("whatsapp.defaultMessage")}
                source="about"
                size="sm"
                fallbackHref={getPathname({ href: "/contacto", locale })}
              />
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
