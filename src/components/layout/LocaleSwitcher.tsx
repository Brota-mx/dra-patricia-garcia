"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Cambia de idioma preservando la ruta equivalente.
 * Con pathnames localizados, /es/servicios ↔ /en/services.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const other = routing.locales.find((l) => l !== locale) as Locale;
  const label = other === "en" ? "EN" : "ES";

  return (
    <button
      type="button"
      onClick={() =>
        router.replace(
          // @ts-expect-error — los params de una ruta dinámica no son
          // tipables genéricamente aquí; next-intl los reenvía tal cual.
          { pathname, params },
          { locale: other },
        )
      }
      className={cn(
        "font-display text-sm font-medium text-muted transition-colors hover:text-ink",
        className,
      )}
      lang={other}
      aria-label={other === "en" ? "Switch to English" : "Cambiar a español"}
    >
      {label}
    </button>
  );
}
