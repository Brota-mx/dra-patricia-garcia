import { test, expect } from "@playwright/test";

/**
 * Carga las 8 rutas del sitio en ambos idiomas y confirma que no hay errores
 * de consola. El artículo de blog se prueba solo si hay al menos uno
 * publicado (Sanity puede no estar configurado en el entorno de prueba).
 *
 * Un único mensaje se ignora a propósito: Zod (usado por el formulario)
 * hace un self-check con `eval` para saber si puede compilar sus
 * validadores en JIT. La CSP de la Fase 12 no permite `unsafe-eval` — Zod
 * lo detecta, cae a modo interpretado sin romper nada, pero el navegador
 * igual reporta el intento bloqueado como violación de CSP. Es ruido
 * esperado, no una regresión real. Ver next.config.ts.
 */
const KNOWN_HARMLESS_CSP_NOISE =
  /violates the following Content Security Policy directive.*script-src/i;

/**
 * `@vercel/analytics` intenta cargar `/_vercel/insights/script.js`, una ruta
 * que solo existe cuando el sitio corre de verdad en la infraestructura de
 * Vercel (con Web Analytics habilitado). En local/CI no existe. Se filtra
 * por URL de la respuesta fallida, no por texto de consola — el mensaje
 * genérico "Failed to load resource: 404" no trae la URL, así que
 * adivinarlo por texto escondería 404 reales de otros recursos.
 */
const ALLOWED_FAILING_PATHS = ["/_vercel/insights/script.js"];
const KNOWN_HARMLESS_VERCEL_INSIGHTS_NOISE = /_vercel\/insights\/script\.js/;

const ROUTES = {
  es: [
    "/es",
    "/es/servicios",
    "/es/servicios/medicina-general",
    "/es/sobre-mi",
    "/es/blog",
    "/es/contacto",
    "/es/aviso-de-privacidad",
  ],
  en: [
    "/en",
    "/en/services",
    "/en/services/general-medicine",
    "/en/about",
    "/en/blog",
    "/en/contact",
    "/en/privacy-policy",
  ],
} as const;

for (const [locale, routes] of Object.entries(ROUTES)) {
  for (const route of routes) {
    test(`${route} carga sin errores de consola (${locale})`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      const unexpectedFailedRequests: string[] = [];

      page.on("console", (msg) => {
        const text = msg.text();
        // El "Failed to load resource" genérico no trae URL — se valida por
        // separado con el listener de "response" de abajo, que sí la tiene.
        if (
          msg.type() === "error" &&
          !KNOWN_HARMLESS_CSP_NOISE.test(text) &&
          !KNOWN_HARMLESS_VERCEL_INSIGHTS_NOISE.test(text) &&
          !text.startsWith("Failed to load resource")
        ) {
          consoleErrors.push(text);
        }
      });
      page.on("pageerror", (err) => consoleErrors.push(err.message));
      page.on("response", (res) => {
        if (
          res.status() >= 400 &&
          !ALLOWED_FAILING_PATHS.some((p) => res.url().includes(p))
        ) {
          unexpectedFailedRequests.push(`${res.status()} ${res.url()}`);
        }
      });

      const response = await page.goto(route);
      expect(response?.status(), `${route} debe responder 200`).toBe(200);
      await expect(page.locator("body")).toBeVisible();
      expect(
        unexpectedFailedRequests,
        `recursos fallidos en ${route}`,
      ).toEqual([]);
      expect(consoleErrors, `errores de consola en ${route}`).toEqual([]);
    });
  }
}

test("el listado de blog abre el primer artículo si hay alguno publicado", async ({
  page,
}) => {
  await page.goto("/es/blog");
  const firstArticle = page.locator("main a[href*='/blog/']").first();

  if ((await firstArticle.count()) === 0) {
    test.skip(true, "sin artículos publicados en este entorno (Sanity no configurado)");
  }

  await firstArticle.click();
  await expect(page).toHaveURL(/\/blog\/.+/);
  await expect(page.locator("h1")).toBeVisible();
});
