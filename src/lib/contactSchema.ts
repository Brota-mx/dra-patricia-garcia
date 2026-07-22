import { z } from "zod";

/**
 * Servicios que se pueden ofrecer como motivo de contacto.
 *
 * Solo los publicables (`isPublishable()` en content/services.ts) más una
 * opción genérica. Los procedimientos estéticos sin divulgación obligatoria
 * completa no aparecen aquí por la misma razón que no tienen página propia:
 * el régimen publicitario de COFEPRIS para embellecimiento (permiso, no
 * aviso) no está resuelto todavía. Ver docs/investigacion/compliance-publicidad.md.
 */
export const contactServiceOptions = [
  "general-medicine",
  "skincare",
  "other",
] as const;

export type ContactServiceOption = (typeof contactServiceOptions)[number];

/**
 * Schema compartido entre el formulario (cliente) y `/api/contact` (servidor).
 *
 * `message` tiene tope de 300 caracteres a propósito: es espacio para decir
 * qué buscas, no para describir síntomas o historial clínico. El formulario
 * nunca pide datos de salud (regla no negociable — LFPDPPP los trata como
 * datos personales sensibles).
 *
 * `company` es el honeypot: un campo oculto que un humano nunca llena. Se
 * valida por separado en la API, no aquí, para no revelar su existencia en
 * los mensajes de error del formulario.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().trim().max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  service: z.enum(contactServiceOptions),
  message: z.string().trim().min(10).max(300),
  company: z.string().max(200).optional(),
  turnstileToken: z.string().min(1),
  locale: z.enum(["es", "en"]),
});

/**
 * Forma que vive en el formulario (React Hook Form) ANTES de validar —
 * `z.input`, no `z.infer`/`z.output`. Con schemas que transforman o ponen
 * default, ambos difieren y zodResolver espera el de entrada.
 */
export type ContactFormValues = z.input<typeof contactSchema>;
