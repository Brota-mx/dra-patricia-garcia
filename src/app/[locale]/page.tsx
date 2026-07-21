import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { clinic } from "@/content/clinic";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <main className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-6 py-24">
      <p className="eyebrow text-malva">{t("hero.eyebrow")}</p>
      <h1 className="mt-4 text-4xl sm:text-6xl">{t("hero.title")}</h1>
      <p className="mt-3 text-lg text-muted">{t("hero.subtitle")}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <span className="rounded-full border border-line bg-surface px-4 py-2 text-sm">
          {t("credentials.school")}
        </span>
        <span className="rounded-full border border-line bg-surface px-4 py-2 text-sm">
          {t("credentials.cofeprisLabel")} {clinic.cofepris}
        </span>
      </div>

      {/*
        Fase 0: andamio mínimo verificando i18n + tokens.
        Las secciones reales (Hero, ServicesGrid, CredentialsBand, FAQ,
        LocationMap, BookingCTA) llegan en la Fase 4 — ver BLUEPRINT.md §9.
      */}
      <p className="mt-16 max-w-[68ch] text-sm text-muted">
        Andamio de Fase 0. Siguiente: Fase 1 · Sistema de diseño.
      </p>
    </main>
  );
}
