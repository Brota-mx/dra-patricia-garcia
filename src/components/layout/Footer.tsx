import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { mainNav, legalNav } from "@/content/navigation";
import { clinic } from "@/content/clinic";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Marca */}
          <div className="md:col-span-2">
            <p className="font-display text-title font-semibold tracking-[0.06em] uppercase">
              {clinic.name}
            </p>
            <p className="mt-3 max-w-[40ch] text-sm text-muted">
              {t("footer.tagline")}
            </p>
            {/* La credencial sanitaria es un activo de confianza: va visible,
                no escondida en una página interna. */}
            <p className="mt-6 text-sm text-muted">
              {t("credentials.cofeprisLabel")}{" "}
              <span className="text-ink">{clinic.cofepris}</span>
            </p>
            <p className="text-sm text-muted">{clinic.school}</p>
          </div>

          {/* Navegación */}
          <div>
            <p className="eyebrow text-muted">{t("footer.navTitle")}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-malva-deep"
                  >
                    {t(`nav.${item.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto + legal */}
          <div>
            <p className="eyebrow text-muted">{t("footer.contactTitle")}</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="text-muted">
                {clinic.city}, {clinic.state}
              </li>
              {/* TODO(cliente): dirección y horarios reales. Hasta entonces no
                  inventamos nada — se remite a WhatsApp. */}
              <li className="text-muted">{t("footer.addressPending")}</li>
              <li>
                <a
                  href={clinic.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-malva-deep"
                >
                  Instagram
                </a>
              </li>
            </ul>

            <p className="eyebrow mt-8 text-muted">{t("footer.legalTitle")}</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-malva-deep"
                  >
                    {t(`nav.${item.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <p className="text-sm text-muted">
            &copy; {year} {clinic.name}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
