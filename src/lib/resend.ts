import { Resend } from "resend";

/**
 * Variables requeridas para enviar el correo del formulario de contacto.
 * Ausentes en un fork/preview sin secretos configurados — `/api/contact`
 * debe fallar cerrado (503) en ese caso, no intentar enviar de todos modos.
 */
export function contactEmailEnv() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

export function getResendClient(apiKey: string) {
  return new Resend(apiKey);
}
