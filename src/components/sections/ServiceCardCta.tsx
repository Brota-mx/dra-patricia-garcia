"use client";

import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/whatsapp";

/** CTA de una tarjeta de servicio. Cliente sólo por la medición del clic. */
export function ServiceCardCta({
  message,
  serviceId,
  label,
  fallbackHref,
}: {
  message: string;
  serviceId: string;
  label: string;
  /** Ruta de contacto YA localizada — evita una redirección extra. */
  fallbackHref: string;
}) {
  const href = whatsappLink({ message });

  return (
    <Button
      size="sm"
      variant="secondary"
      href={href ?? fallbackHref}
      onClick={() => track("whatsapp_click", { source: `service:${serviceId}` })}
    >
      {label}
    </Button>
  );
}
