import { useTranslations } from "next-intl";
import { clinic } from "@/content/clinic";

/**
 * Ubicación del consultorio.
 *
 * Todavía no tenemos dirección ni coordenadas (`clinic.address` y `clinic.geo`
 * están en `null`), así que la sección muestra la ciudad y remite a WhatsApp
 * para el dato exacto. No se inventa una dirección ni se pinta un mapa
 * apuntando al centro de Playa del Carmen "para que se vea lleno".
 *
 * Cuando lleguen los datos, aparecen el mapa y el enlace a Google Maps.
 */
export function LocationMap() {
  const t = useTranslations("sections");

  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <h2 className="text-heading">{t("locationTitle")}</h2>
        <p className="mt-3 text-muted">{t("locationLead")}</p>

        {clinic.address ? (
          <address className="mt-6 text-body-lg not-italic">
            {clinic.address.street}
            <br />
            {clinic.address.neighborhood}, {clinic.address.postalCode}
            <br />
            {clinic.city}, {clinic.state}
          </address>
        ) : (
          // TODO(cliente): dirección exacta, horarios y coordenadas.
          <p className="mt-6 max-w-[52ch] text-muted">
            {t("locationPending")}
          </p>
        )}
      </div>
    </section>
  );
}
