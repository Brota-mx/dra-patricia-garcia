/**
 * Feature flags.
 *
 * 🔴 `beforeAfter` y `testimonials` están APAGADAS por decisión legal, no
 * técnica. La publicidad de servicios de salud en México está regulada
 * (Ley General de Salud y su reglamento en materia de publicidad), y las
 * imágenes comparativas de pacientes son la zona más restringida.
 *
 * NO encender sin: (a) consentimiento firmado de cada paciente mostrado y
 * (b) confirmación del cliente sobre qué permite la normativa.
 * Ver BLUEPRINT.md §8.2.
 */
export const flags = {
  beforeAfter: process.env.NEXT_PUBLIC_FEATURE_BEFORE_AFTER === "true",
  testimonials: process.env.NEXT_PUBLIC_FEATURE_TESTIMONIALS === "true",
} as const;
