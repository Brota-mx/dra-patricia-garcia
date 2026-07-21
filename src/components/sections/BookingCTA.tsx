"use client";

import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Par de CTAs: WhatsApp (lo que convierte) y una acción secundaria.
 *
 * El clic se mide porque los clics a WhatsApp son la métrica de éxito #1 del
 * proyecto (BLUEPRINT.md §1), y `source` permite saber qué sección los generó.
 *
 * Sin número configurado el botón de WhatsApp cae a /contacto en lugar de
 * romperse: mejor una ruta útil que un enlace muerto.
 */
export function BookingCTA({
  message,
  source,
  fallbackHref,
  secondaryHref,
  secondaryLabel,
  size = "lg",
}: {
  message: string;
  source: string;
  /** Ruta de contacto YA localizada — evita una redirección extra. */
  fallbackHref: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  size?: "sm" | "md" | "lg";
}) {
  const t = useTranslations("hero");
  const href = whatsappLink({ message });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        size={size}
        href={href ?? fallbackHref}
        onClick={() => track("whatsapp_click", { source })}
      >
        {t("cta")}
      </Button>

      {secondaryHref && secondaryLabel && (
        <Button size={size} variant="secondary" href={secondaryHref}>
          {secondaryLabel}
        </Button>
      )}
    </div>
  );
}
