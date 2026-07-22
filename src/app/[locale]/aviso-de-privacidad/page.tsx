import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import {
  legalNoticeLastUpdated,
  privacyNoticeSections,
} from "@/content/legalNotice";
import { getPathname } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.privacy" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates("/aviso-de-privacidad", locale),
    // Fase 10: aviso real, ya se indexa — es texto legal público, no una
    // página "próximamente".
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.privacy");
  const contactHref = getPathname({ href: "/contacto", locale });

  // `legalNoticeLastUpdated` es una fecha calendario sin hora ("2026-07-21"),
  // no un instante. El motor JS la interpreta como medianoche UTC; formatear
  // en CUALQUIER huso detrás de UTC (incluido el del consultorio) la corre un
  // día hacia atrás. Se fuerza `timeZone: "UTC"` para mostrar el día tal como
  // está escrito — un aviso legal no puede mostrar una fecha equivocada.
  const lastUpdated = new Date(legalNoticeLastUpdated).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <p className="eyebrow text-malva-deep">{t("title")}</p>
      <h1 className="mt-4 max-w-[24ch] text-display">{t("title")}</h1>
      <p className="mt-6 max-w-[62ch] text-body-lg text-muted">
        {t("intro")}
      </p>
      <p className="mt-4 text-sm text-muted">
        {t("lastUpdated", { date: lastUpdated })}
      </p>

      <Prose className="mt-16">
        {privacyNoticeSections.map((section) => (
          <div key={section.heading.es}>
            <h2>{section.heading[locale]}</h2>
            {section.paragraphs[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ))}
      </Prose>

      <div className="mt-16 border-t border-line pt-8">
        <p className="max-w-[62ch] text-muted">{t("rightsCta")}</p>
        <div className="mt-6">
          <Button href={contactHref}>{t("rightsCtaButton")}</Button>
        </div>
      </div>
    </main>
  );
}
