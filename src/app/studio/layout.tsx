import type { ReactNode } from "react";

/**
 * El Studio es un documento HTML independiente del sitio público: vive fuera
 * de `[locale]` (excluido del middleware de next-intl — ver src/middleware.ts)
 * y no comparte Header/Footer/i18n con el marketing site. Por eso es el único
 * otro layout del proyecto que renderiza `<html>` — la regla "sólo
 * [locale]/layout.tsx" es sobre las rutas del sitio público, no sobre el CMS.
 */
export const metadata = {
  title: "Studio · Dra. Patricia García",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
