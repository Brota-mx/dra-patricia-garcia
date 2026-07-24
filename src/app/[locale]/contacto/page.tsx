import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/forms/ContactForm";
import { CalEmbed } from "@/components/sections/CalEmbed";
import { LocationMap } from "@/components/sections/LocationMap";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { clinic } from "@/content/clinic";
import { getPathname } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo";
import { seoKeywords } from "@/content/seoKeywords";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

  return {
    title: t("title"),
    description: t("lead"),
    alternates: buildAlternates("/contacto", locale),
    keywords: seoKeywords.contact[locale],
    // Se quita el noindex de la Fase 2: ya tiene formulario funcional.
  };
}

/** 2023-01-01 fue domingo — referencia para nombrar el día 0 del horario. */
function weekdayLabel(day: number, locale: Locale): string {
  const reference = new Date(2023, 0, 1 + day);
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    reference,
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK;
  const privacyHref = getPathname({ href: "/aviso-de-privacidad", locale });

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <p className="eyebrow text-malva-deep">{t("contactPage.eyebrow")}</p>
      <h1 className="mt-4 max-w-[22ch] text-display">
        {t("contactPage.title")}
      </h1>
      <p className="mt-6 max-w-[58ch] text-body-lg text-muted">
        {t("contactPage.lead")}
      </p>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-subheading">{t("contactPage.formTitle")}</h2>
          <div className="mt-6">
            <ContactForm locale={locale} privacyHref={privacyHref} />
          </div>
        </div>

        <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
          <div>
            <h2 className="text-subheading">{t("hero.cta")}</h2>
            <div className="mt-6">
              <BookingCTA
                message={t("whatsapp.defaultMessage")}
                source="contacto"
                size="md"
                fallbackHref={getPathname({ href: "/contacto", locale })}
              />
            </div>
          </div>

          <div>
            <h2 className="text-subheading">{t("contactPage.hoursTitle")}</h2>
            {clinic.hours ? (
              <ul className="mt-6 space-y-1 text-muted">
                {clinic.hours.map((slot, i) => (
                  <li key={i}>
                    {slot.days.map((d) => weekdayLabel(d, locale)).join(", ")}
                    {": "}
                    {slot.opens}–{slot.closes}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 max-w-[40ch] text-muted">
                {t("contactPage.hoursPending")}
              </p>
            )}
          </div>
        </aside>
      </div>

      <div className="mt-20">
        <h2 className="text-subheading">{t("contactPage.calTitle")}</h2>
        {calLink ? (
          <div className="mt-6">
            <CalEmbed calLink={calLink} />
          </div>
        ) : (
          <p className="mt-6 max-w-[52ch] text-muted">
            {t("contactPage.calPending")}
          </p>
        )}
      </div>

      <div className="mt-20">
        <LocationMap />
      </div>
    </main>
  );
}
