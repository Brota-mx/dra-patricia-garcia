import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { clinic } from "@/content/clinic";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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
      <p className="eyebrow text-malva-deep">{t("hero.eyebrow")}</p>
      <h1 className="mt-4 text-display sm:text-display-xl">{t("hero.title")}</h1>
      <p className="mt-3 text-body-lg text-muted">{t("hero.subtitle")}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Badge>{t("credentials.school")}</Badge>
        <Badge tone="accent">
          {t("credentials.cofeprisLabel")} {clinic.cofepris}
        </Badge>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button size="lg">{t("hero.cta")}</Button>
        <Button size="lg" variant="secondary">
          {t("hero.ctaSecondary")}
        </Button>
      </div>

      {/*
        Andamio. Las secciones reales (Hero, ServicesGrid, CredentialsBand, FAQ,
        LocationMap, BookingCTA) llegan en la Fase 4 — ver BLUEPRINT.md §9.
        Los CTAs de arriba todavía no apuntan a ningún lado: WhatsApp y Cal.com
        se cablean en la Fase 8.
      */}
      <p className="mt-16 max-w-[68ch] text-sm text-muted">
        Andamio de Fase 1 · Sistema de diseño. Siguiente: Fase 2 · Layout + SEO base.
      </p>
    </main>
  );
}
