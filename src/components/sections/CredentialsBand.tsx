import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { clinic } from "@/content/clinic";

/**
 * Franja de credenciales.
 *
 * No es decoración: el art. 83 LGS y el art. 19 RLGSMP obligan a expresar en la
 * publicidad la institución que expidió el título y el número de cédula
 * profesional. Y en salud (YMYL) es la señal de autoridad que más pesa.
 *
 * La cédula todavía no la tenemos (`clinic.license === null`), así que
 * simplemente no se renderiza — nunca un número inventado ni un "próximamente".
 */
export function CredentialsBand() {
  const t = useTranslations();

  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <p className="eyebrow text-muted">{t("sections.credentialsTitle")}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Badge>{clinic.school}</Badge>
          <Badge tone="accent">
            {t("credentials.cofeprisLabel")} {clinic.cofepris}
          </Badge>
          {/* TODO(cliente): cédula profesional. Obligatoria por art. 19 RLGSMP;
              en cuanto llegue, este bloque aparece solo. */}
          {clinic.license && <Badge>Cédula {clinic.license}</Badge>}
        </div>
      </div>
    </section>
  );
}
