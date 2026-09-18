import { useTranslations } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { BookingCTA } from "./BookingCTA";

/**
 * Hero.
 *
 * El titular dice QUÉ es y CON QUÉ CRITERIO, no sólo el nombre de la doctora
 * — un hero que sólo repite el nombre no comunica propuesta (lección de la
 * auditoría de Pagaza).
 *
 * El párrafo cierra con "y si algo no es adecuado para ti, te lo digo": es el
 * posicionamiento deliberado del sitio. La investigación de pacientes mostró
 * que el mercado se está reconfigurando alrededor del miedo a sobrellenarse, y
 * que la señal más diferenciadora hoy es la disposición a decir que no.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations();

  return (
    <section className="mx-auto grid max-w-[1200px] gap-10 px-6 pt-12 pb-14 sm:pt-20 sm:pb-20 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-16">
      <div>
        <p className="eyebrow text-malva-deep">{t("hero.eyebrow")}</p>

        <h1 className="mt-5 max-w-[18ch] text-display sm:text-display-xl">
          {t("hero.title")}
        </h1>

        <p className="mt-6 max-w-[58ch] text-body-lg text-muted">
          {t("hero.lead")}
        </p>

        <div className="mt-10">
          <BookingCTA
            message={t("whatsapp.defaultMessage")}
            source="hero"
            fallbackHref={getPathname({ href: "/contacto", locale })}
            secondaryHref={getPathname({ href: "/servicios", locale })}
            secondaryLabel={t("hero.ctaSecondary")}
          />
        </div>

        <p className="mt-6 text-sm text-muted">{t("hero.note")}</p>

        <div className="mt-7 flex flex-wrap gap-2">
          <span className="rounded-full border border-line bg-surface px-3 py-2 text-xs font-medium text-ink">
            {t("hero.credential")}
          </span>
          <span className="rounded-full bg-malva-soft px-3 py-2 text-xs font-medium text-ink">
            {t("credentials.cofeprisLabel")} {t("credentials.cofepris")}
          </span>
        </div>
      </div>

      <div className="relative lg:before:absolute lg:before:-inset-4 lg:before:rounded-card lg:before:bg-malva-soft">
        {/* eslint-disable-next-line @next/next/no-img-element -- mismo patrón que el retrato de Sobre-mí: activo estático servido desde public/. */}
        <img
          src="/practitioner/dra-patricia-garcia-hero.jpg"
          alt={t("hero.imageAlt")}
          className="relative aspect-[16/10] w-full rounded-card object-cover shadow-subtle lg:aspect-[4/5]"
        />
      </div>
    </section>
  );
}
