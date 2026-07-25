import { test, expect } from "@playwright/test";

/**
 * Navegación por teclado del acordeón de FAQ y del menú móvil — los dos
 * componentes interactivos más usados del sitio fuera del formulario.
 * Ambos son primitivas de Radix, pero se verifica el comportamiento real,
 * no se asume que la librería lo garantiza.
 */
test("el acordeón de FAQ se abre y cierra con teclado", async ({ page }) => {
  await page.goto("/es");
  const faqSection = page.locator("section", { has: page.getByText("Preguntas frecuentes") });

  if ((await faqSection.count()) === 0) {
    test.skip(
      true,
      "sin preguntas contestadas todavía (todas las respuestas en content/faq.ts son null, pendientes de la doctora) — la sección no renderiza a propósito",
    );
  }

  const firstTrigger = faqSection.getByRole("button").first();
  await firstTrigger.focus();
  await expect(firstTrigger).toHaveAttribute("data-state", "closed");

  await page.keyboard.press("Enter");
  await expect(firstTrigger).toHaveAttribute("data-state", "open");

  await page.keyboard.press("Enter");
  await expect(firstTrigger).toHaveAttribute("data-state", "closed");
});

test.describe("Menú móvil", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("se abre con Enter y cierra con Escape, ambos por teclado", async ({
    page,
  }) => {
    await page.goto("/es");

    const trigger = page.getByRole("button", { name: "Abrir menú" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Menú" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Servicios" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
