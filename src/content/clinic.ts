import type { Localized, PendingFromClinician } from "@/types/content";

export type OpeningHours = {
  /** 0 = domingo … 6 = sábado */
  days: number[];
  opens: string; // "09:00"
  closes: string; // "18:00"
};

/**
 * Datos del consultorio.
 *
 * ⚠️ Los campos `null` son TODO(cliente): datos operativos reales que bloquean
 * el go-live. `null` significa "todavía no lo tenemos", no "no aplica" — la UI
 * debe omitirlos, nunca inventar un valor plausible. Ver BLUEPRINT.md §17.
 */
export const clinic = {
  /** Nombre público de la marca, tal como aparece en el logo. */
  name: "Dra. Patricia García",
  specialty: {
    es: "Medicina General y Estética",
    en: "General & Aesthetic Medicine",
  } satisfies Localized,

  /** Verificados en el perfil público de Instagram (@doctorapatga). */
  cofepris: "2623032002A00011",
  school: "Instituto Politécnico Nacional",

  city: "Playa del Carmen",
  state: "Quintana Roo",
  country: "MX",
  timezone: "America/Cancun",

  instagram: "https://www.instagram.com/doctorapatga/",

  /** Dirección exacta — TODO(cliente). Necesaria para el JSON-LD LocalBusiness. */
  address: null as PendingFromClinician<{
    street: string;
    neighborhood: string;
    postalCode: string;
  }>,

  /** Coordenadas para mapa y JSON-LD — TODO(cliente). */
  geo: null as PendingFromClinician<{ lat: number; lng: number }>,

  /** Horarios de atención — TODO(cliente). */
  hours: null as PendingFromClinician<OpeningHours[]>,

  /** Cédula profesional — TODO(cliente). Pesa para E-E-A-T en salud (YMYL). */
  license: null as PendingFromClinician<string>,

  /**
   * WhatsApp y correo se leen de env, no se hardcodean: cambian sin tocar
   * código y no quedan escritos en el repo público.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
} as const;
