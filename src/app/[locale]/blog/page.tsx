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
  const t = await getTranslations({ locale, namespace: "pages.blog" });

  return {
    title: t("title"),
    alternates: buildAlternates("/blog", locale),
    // TODO(Fase 9): quitar el noindex al conectar Sanity.
    robots: { index: false, follow: true },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.blog");

  return (
    <PagePlaceholder title={t("title")} intro={t("intro")} phase="Fase 9" />
  );
}
