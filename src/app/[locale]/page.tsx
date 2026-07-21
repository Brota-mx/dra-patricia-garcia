import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { CredentialsBand } from "@/components/sections/CredentialsBand";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { FAQ } from "@/components/sections/FAQ";
import { LocationMap } from "@/components/sections/LocationMap";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { buildAlternates } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: buildAlternates("/", locale) };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Hero locale={locale} />
      <CredentialsBand />
      <ServicesGrid locale={locale} />
      {/* Se autooculta mientras la doctora no conteste las preguntas. */}
      <FAQ locale={locale} />
      <LocationMap />

      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <h2 className="text-heading">{t("sections.bookingTitle")}</h2>
        <p className="mt-3 max-w-[52ch] text-muted">
          {t("sections.bookingLead")}
        </p>
        <div className="mt-8">
          <BookingCTA
            message={t("whatsapp.defaultMessage")}
            source="home-footer"
            fallbackHref={getPathname({ href: "/contacto", locale })}
          />
        </div>
      </section>
    </>
  );
}
