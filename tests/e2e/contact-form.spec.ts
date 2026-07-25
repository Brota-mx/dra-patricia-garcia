import { test, expect } from "@playwright/test";

/**
 * El formulario nunca pide datos de salud, y en un entorno sin
 * `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (como CI/preview sin secretos) debe
 * degradarse con dignidad: mostrar el aviso y deshabilitar el envío, no
 * fingir que funciona. Ver CLAUDE.md "Variables de entorno".
 */
test.describe("Formulario de contacto", () => {
  test("renderiza los campos esperados, sin ningún campo de salud", async ({
    page,
  }) => {
    await page.goto("/es/contacto");

    await expect(page.getByLabel("Nombre")).toBeVisible();
    await expect(page.getByLabel("Correo")).toBeVisible();
    await expect(page.getByLabel("Teléfono (opcional)")).toBeVisible();
    await expect(page.getByLabel("¿Qué te interesa?")).toBeVisible();
    await expect(
      page.getByLabel("Cuéntame brevemente qué buscas"),
    ).toBeVisible();

    // Regla no negociable: nunca debe existir un campo que pida síntomas,
    // padecimiento o historial clínico.
    await expect(page.getByText(/no incluyas datos de salud/i)).toBeVisible();
  });

  test("el contador de caracteres del mensaje se actualiza al escribir", async ({
    page,
  }) => {
    await page.goto("/es/contacto");
    const text = "Quisiera agendar una valoración.";
    const message = page.getByLabel("Cuéntame brevemente qué buscas");
    await message.fill(text);
    await expect(page.getByText(`${text.length}/300`)).toBeVisible();
  });

  test("sin Turnstile configurado, el envío queda deshabilitado con aviso visible", async ({
    page,
  }) => {
    await page.goto("/es/contacto");
    await expect(
      page.getByText(/el formulario está terminando de configurarse/i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Enviar mensaje" })).toBeDisabled();
  });
});

test.describe("CTA de WhatsApp", () => {
  test("sin número configurado, cae a /contacto en vez de un enlace roto", async ({
    page,
  }) => {
    await page.goto("/es");
    const cta = page.getByRole("link", { name: "Escribir por WhatsApp" }).first();
    await expect(cta).toHaveAttribute("href", /\/contacto$/);
  });
});
