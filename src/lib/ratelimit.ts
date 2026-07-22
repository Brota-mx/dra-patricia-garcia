import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Límite: 3 envíos por IP cada 10 minutos.
 *
 * Generoso para un visitante real (nadie manda el formulario 4 veces en 10
 * minutos) y suficientemente estricto para frenar un bot que automatiza el
 * endpoint. `analytics: false` — no hay necesidad de mandar métricas de uso
 * del rate limiter a Upstash para un formulario de bajo volumen.
 */
export function getContactRatelimit() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    prefix: "contact-form",
    analytics: false,
  });
}
