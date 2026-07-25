import { test, expect } from "@playwright/test";

/**
 * El selector de idioma debe preservar la ruta equivalente, no mandar
 * siempre al home — con pathnames localizados, /es/servicios ↔ /en/services.
 */
const CASES: Array<{ from: string; label: string; to: string }> = [
  { from: "/es", label: "Switch to English", to: "/en" },
  { from: "/es/servicios", label: "Switch to English", to: "/en/services" },
  { from: "/es/sobre-mi", label: "Switch to English", to: "/en/about" },
  { from: "/es/contacto", label: "Switch to English", to: "/en/contact" },
  { from: "/en", label: "Cambiar a español", to: "/es" },
  { from: "/en/services", label: "Cambiar a español", to: "/es/servicios" },
];

for (const { from, label, to } of CASES) {
  test(`el selector de idioma lleva de ${from} a ${to}`, async ({ page }) => {
    await page.goto(from);
    await page.getByRole("button", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${to}$`));
  });
}
