import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";
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
    alternates: buildAlternates("/aviso-de-privacidad", locale),
    // TODO(Fase 10): quitar el noindex. 🔴 BLOQUEADOR DE GO-LIVE: la LFPDPPP
    // exige este aviso porque el formulario capta datos personales.
    robots: { index: false, follow: true },
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

  return (
    <PagePlaceholder title={t("title")} intro={t("intro")} phase="Fase 10" />
  );
}
