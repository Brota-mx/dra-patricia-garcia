import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Contenedor tipográfico para texto largo (artículos del blog, aviso de
 * privacidad, descripciones de servicio).
 *
 * Ancho fijo en 68ch: la medida cómoda de lectura. Los enlaces usan
 * malva-deep, no malva — 5.13:1 vs 4.01:1.
 */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-body-lg text-ink",
        "[&_p]:mb-6",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-heading",
        "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-subheading",
        "[&_a]:text-malva-deep [&_a]:underline [&_a]:underline-offset-4",
        "[&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mb-2",
        "[&_strong]:font-semibold",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-malva [&_blockquote]:pl-6 [&_blockquote]:text-muted [&_blockquote]:italic",
        className,
      )}
    >
      {children}
    </div>
  );
}
