import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";

// Página interna de referencia. No debe indexarse ni aparecer en el sitemap.
// TODO(go-live): decidir si se elimina o se deja bloqueada. Ver docs/go-live-checklist.md
export const metadata: Metadata = {
  title: "Sistema de diseño (interno)",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "ink", hex: "#14110F", use: "Texto, wordmark, botón hover" },
  { name: "bone", hex: "#FAF7F4", use: "Fondo de página" },
  { name: "surface", hex: "#FFFFFF", use: "Tarjetas, paneles" },
  { name: "malva", hex: "#9C6B8E", use: "Decorativo: iconos, bordes, títulos ≥24px" },
  { name: "malva-deep", hex: "#8A5A7C", use: "Legible: enlaces, texto de acento, botones" },
  { name: "malva-soft", hex: "#EFE2EA", use: "Fondos de acento, hover" },
  { name: "muted", hex: "#6B625C", use: "Texto secundario" },
  { name: "line", hex: "#E5DED8", use: "Bordes, divisores" },
  { name: "success", hex: "#2F7A5B", use: "Confirmaciones" },
  { name: "destructive", hex: "#B3261E", use: "Errores" },
];

export default function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <p className="eyebrow text-malva-deep">Interno · Fase 1</p>
      <h1 className="mt-4 text-display">Sistema de diseño</h1>
      <p className="mt-4 max-w-[68ch] text-body-lg text-muted">
        Referencia viva de los tokens y componentes. Los colores se validan con{" "}
        <code className="rounded bg-malva-soft px-1.5 py-0.5 text-sm">
          pnpm check:contrast
        </code>
        .
      </p>

      {/* Color */}
      <section className="mt-16">
        <h2 className="text-heading">Color</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {swatches.map((s) => (
            <Card key={s.name} className="flex items-start gap-4">
              <div
                className="h-14 w-14 shrink-0 rounded-lg border border-line"
                style={{ backgroundColor: s.hex }}
                aria-hidden="true"
              />
              <div>
                <p className="font-display font-medium">{s.name}</p>
                <p className="text-sm text-muted">{s.hex}</p>
                <p className="mt-1 text-sm text-muted">{s.use}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-malva bg-malva-soft">
          <p className="text-sm">
            <strong>Regla de accesibilidad:</strong> <code>malva</code> da 4.01:1
            sobre <code>bone</code> — suficiente para iconos, bordes y títulos de
            24px o más, pero <strong>no</strong> para texto de cuerpo. Para
            cualquier texto de acento usar <code>malva-deep</code> (5.13:1).
          </p>
        </Card>
      </section>

      {/* Tipografía */}
      <section className="mt-16">
        <h2 className="text-heading">Tipografía</h2>
        <div className="mt-6 space-y-6 border-t border-line pt-6">
          <div>
            <p className="text-sm text-muted">display-xl · 56px · Jost</p>
            <p className="font-display text-display-xl font-semibold">
              Medicina con criterio
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">display · 40px · Jost</p>
            <p className="font-display text-display font-semibold">
              Dra. Patricia García
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">heading · 32px · Jost</p>
            <p className="font-display text-heading font-semibold">
              Servicios del consultorio
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">subheading · 24px · Jost</p>
            <p className="font-display text-subheading font-semibold">
              Preguntas frecuentes
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">eyebrow · 12px · Jost mayúsculas</p>
            <p className="eyebrow text-malva-deep">Medicina general y estética</p>
          </div>
          <div>
            <p className="text-sm text-muted">body · 16px · Inter</p>
            <p className="max-w-[68ch]">
              Consulta de medicina general y medicina estética en Playa del
              Carmen. Cada procedimiento se evalúa en consulta antes de
              proponerse.
            </p>
          </div>
        </div>
      </section>

      {/* Botones */}
      <section className="mt-16">
        <h2 className="text-heading">Botones</h2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button variant="primary">Agendar cita</Button>
          <Button variant="secondary">Ver servicios</Button>
          <Button variant="ghost">Leer más</Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button size="sm">Pequeño</Button>
          <Button size="md">Mediano</Button>
          <Button size="lg">Grande</Button>
        </div>
        <div className="mt-6">
          <Button href="https://example.com">Enlace externo (nueva pestaña)</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="mt-16">
        <h2 className="text-heading">Etiquetas</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge>Instituto Politécnico Nacional</Badge>
          <Badge tone="accent">Cofepris 2623032002A00011</Badge>
          <Badge tone="accent">Medicina estética</Badge>
        </div>
      </section>

      {/* Prose */}
      <section className="mt-16">
        <h2 className="text-heading">Texto largo (Prose)</h2>
        <Prose className="mt-6">
          <h2>Qué esperar de una consulta</h2>
          <p>
            La primera consulta es de valoración. Se revisa tu historial, se
            aclaran dudas y se define si el procedimiento que te interesa es
            adecuado para ti.
          </p>
          <ul>
            <li>Valoración médica completa</li>
            <li>Explicación del procedimiento y sus cuidados</li>
            <li>Resolución de dudas sin compromiso</li>
          </ul>
          <blockquote>
            Este contenido es informativo y no sustituye una consulta médica.
          </blockquote>
        </Prose>
      </section>
    </main>
  );
}
