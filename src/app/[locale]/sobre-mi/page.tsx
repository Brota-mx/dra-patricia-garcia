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
  const t = await getTranslations({ locale, namespace: "pages.about" });

  return {
    title: t("title"),
    alternates: buildAlternates("/sobre-mi", locale),
    // TODO(Fase 6): quitar el noindex. Es la página que más pesa para
    // E-E-A-T en salud — no debe quedarse en noindex por descuido.
    robots: { index: false, follow: true },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.about");

  return (
    <PagePlaceholder title={t("title")} intro={t("intro")} phase="Fase 6" />
  );
}
