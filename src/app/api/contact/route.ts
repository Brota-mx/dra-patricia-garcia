import { NextResponse, type NextRequest } from "next/server";
import { contactSchema } from "@/lib/contactSchema";
import { contactEmailEnv, getResendClient } from "@/lib/resend";
import { getContactRatelimit } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

/** Formulario de texto simple: 10 KB es generoso para cualquier envío legítimo. */
const MAX_BODY_BYTES = 10_000;

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * `POST /api/contact` — único endpoint dinámico del sitio.
 *
 * Fail-closed intencional: si falta cualquiera de las tres integraciones
 * (Resend, Upstash, Turnstile) el endpoint responde 503 sin intentar nada.
 * Ver CLAUDE.md "Variables de entorno".
 *
 * El honeypot y el resultado del captcha nunca se distinguen del éxito real
 * en el cuerpo de la respuesta — sólo en que no se envía correo.
 */
export async function POST(req: NextRequest) {
  const emailEnv = contactEmailEnv();
  const ratelimit = getContactRatelimit();
  const turnstileConfigured = Boolean(process.env.TURNSTILE_SECRET_KEY);

  if (!emailEnv || !ratelimit || !turnstileConfigured) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_input",
        issues: parsed.error.issues.map((issue) => issue.path.join(".")),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot lleno → probablemente un bot. Se responde éxito falso: nunca se
  // le confirma a un bot que fue detectado, y nunca se envía el correo.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(req);

  let withinLimit: boolean;
  try {
    ({ success: withinLimit } = await ratelimit.limit(ip));
  } catch {
    // Upstash caído no debe tumbar el endpoint con un stack trace: se trata
    // como falla de infraestructura, no como resultado de negocio.
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  if (!withinLimit) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const captchaOk = await verifyTurnstile(data.turnstileToken, ip);
  if (!captchaOk) {
    return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
  }

  const resend = getResendClient(emailEnv.apiKey);
  const subject =
    data.locale === "en"
      ? `New contact form message — ${data.name}`
      : `Nuevo mensaje del formulario — ${data.name}`;

  // Texto plano a propósito: nada de lo que escribe el visitante se
  // interpreta como HTML en ningún punto del flujo, así que no hay
  // superficie de inyección que sanear.
  const text = [
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
    data.phone ? `Teléfono: ${data.phone}` : null,
    `Servicio de interés: ${data.service}`,
    "",
    data.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  try {
    const sent = await resend.emails.send({
      from: emailEnv.from,
      to: emailEnv.to,
      replyTo: data.email,
      subject,
      text,
    });

    if (sent.error) {
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
