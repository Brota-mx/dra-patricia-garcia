import { ImageResponse } from "next/og";
import { clinic } from "@/content/clinic";
import type { Locale } from "@/i18n/routing";

export const runtime = "nodejs";
export const alt = "Dra. Patricia García — Medicina General y Estética";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colores de marca en hex — ImageResponse renderiza con Satori, que no lee
// las custom properties de Tailwind (`@theme` en globals.css). Mismos valores
// que `ink`/`bone`/`malva-deep` documentados en CLAUDE.md §Sistema de diseño.
const INK = "#14110F";
const BONE = "#FAF7F4";
const MALVA_DEEP = "#8A5A7C";

/**
 * OG por defecto de cada locale — se hereda en todas las rutas hijas salvo
 * que definan la suya (el artículo de blog con portada real la sobrescribe).
 * Sin logo vectorial todavía (`work/` sólo tiene un JPG — TODO(cliente)), así
 * que es tipografía sobre color de marca, no un render del isotipo.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const eyebrow =
    locale === "es" ? "Playa del Carmen, Quintana Roo" : "Playa del Carmen, Mexico";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          backgroundColor: BONE,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: MALVA_DEEP,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 28,
              color: MALVA_DEEP,
              letterSpacing: 3,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {eyebrow}
          </span>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 76,
            fontWeight: 600,
            color: INK,
            display: "flex",
            lineHeight: 1.1,
          }}
        >
          {clinic.name}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            color: INK,
            display: "flex",
            maxWidth: 880,
          }}
        >
          {clinic.specialty[locale]}
        </div>
      </div>
    ),
    { ...size },
  );
}
