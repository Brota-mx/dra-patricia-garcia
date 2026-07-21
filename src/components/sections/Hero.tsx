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
    <section className="mx-auto max-w-[1200px] px-6 pt-16 pb-20 sm:pt-24">
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
    </section>
  );
}
