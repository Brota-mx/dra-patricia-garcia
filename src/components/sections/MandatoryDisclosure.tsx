import { useTranslations } from "next-intl";
import type { MandatoryDisclosure as Disclosure } from "@/types/content";
import type { Locale } from "@/i18n/routing";

/**
 * 🔴 Divulgación legalmente obligatoria: riesgos, contraindicaciones y efectos
 * secundarios de un procedimiento de embellecimiento.
 *
 * El art. 65 fr. II y III del RLGSMP exige manifestarlos "de manera clara".
 * Por eso esta sección:
 *   · NO va dentro de un acordeón colapsado
 *   · NO va en un modal
 *   · NO va en letra pequeña ni en gris tenue
 *   · va ARRIBA del CTA, no debajo
 *
 * Además, incluir los riesgos sube el E-E-A-T en lugar de bajarlo: ocultarlos
 * es señal de contenido comercial de baja calidad para los evaluadores de
 * Google, y el paciente informado desconfía de quien no los menciona.
 */
export function MandatoryDisclosureSection({
  disclosure,
  locale,
}: {
  disclosure: Disclosure;
  locale: Locale;
}) {
  const t = useTranslations("disclosure");
  const { risks, contraindications, sideEffects } = disclosure;

  // Si falta cualquiera de los tres, el servicio no debería estar publicado
  // (isPublishable lo impide). Guardia defensiva por si alguien lo salta.
  if (!risks || !contraindications || !sideEffects) return null;

  const blocks = [
    { title: t("risks"), items: risks[locale] },
    { title: t("contraindications"), items: contraindications[locale] },
    { title: t("sideEffects"), items: sideEffects[locale] },
  ];

  return (
    <section
      aria-labelledby="divulgacion"
      className="mt-16 rounded-card border border-line bg-surface p-8"
    >
      <h2 id="divulgacion" className="text-subheading">
        {t("title")}
      </h2>

      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {blocks.map((block) => (
          <div key={block.title}>
            <h3 className="font-display text-base font-medium">
              {block.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {block.items.map((item) => (
                <li key={item} className="text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 border-t border-line pt-6 text-sm text-muted">
        {t("note")}
      </p>
    </section>
  );
}
