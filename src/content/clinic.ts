/**
 * Datos del consultorio.
 *
 * ⚠️ Los campos marcados TODO(cliente) NO deben inventarse. Son datos
 * operativos reales que bloquean el go-live — ver BLUEPRINT.md §17.
 */
export const clinic = {
  /** Nombre público de la marca, tal como aparece en el logo. */
  name: "Dra. Patricia García",
  specialty: {
    es: "Medicina General y Estética",
    en: "General & Aesthetic Medicine",
  },

  /** Verificado en el perfil público de Instagram (@doctorapatga). */
  cofepris: "2623032002A00011",
  school: "Instituto Politécnico Nacional",

  city: "Playa del Carmen",
  state: "Quintana Roo",
  country: "MX",

  instagram: "https://www.instagram.com/doctorapatga/",

  // TODO(cliente): dirección exacta del consultorio.
  address: null as string | null,
  // TODO(cliente): coordenadas para el mapa y el JSON-LD LocalBusiness.
  geo: null as { lat: number; lng: number } | null,
  // TODO(cliente): horarios de atención.
  hours: null as Array<{ days: string; open: string; close: string }> | null,
  // TODO(cliente): número de WhatsApp en formato internacional (ej. 52984…).
  //   En runtime se lee de NEXT_PUBLIC_WHATSAPP_NUMBER.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  // TODO(cliente): cédula profesional.
  license: null as string | null,
} as const;
