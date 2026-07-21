import type { Locale } from "@/i18n/routing";

/**
 * Construye el deep link de WhatsApp con mensaje pre-llenado.
 * Nunca armar estos enlaces a mano en un componente — siempre por aquí.
 */
export function whatsappLink(opts: {
  /** Mensaje ya redactado en el idioma del visitante. */
  message: string;
  /** Número en formato internacional sin símbolos, ej. "529841234567". */
  number?: string | null;
}): string | null {
  const number = (opts.number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
    ?.replace(/\D/g, "")
    .trim();

  // Sin número configurado no devolvemos un enlace roto: quien llame decide
  // si oculta el botón o muestra un fallback.
  if (!number) return null;

  return `https://wa.me/${number}?text=${encodeURIComponent(opts.message)}`;
}

/** Mensaje por defecto según idioma, cuando no hay servicio específico. */
export function defaultIntent(locale: Locale): string {
  return locale === "en"
    ? "Hi! I'd like to book an appointment."
    : "¡Hola! Me gustaría agendar una cita.";
}
