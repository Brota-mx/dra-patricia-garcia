import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    // Puerto propio de este proyecto (3200) — con `reuseExistingServer`, dos
    // proyectos de Brota corriendo en el 3000 por default hacen que los E2E
    // de uno se enganchen al dev server del otro. Ya pasó con Pagaza (3100).
    // Ver Planes - Brota.md "Convenciones de Brota".
    baseURL: "http://localhost:3200",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    // Deliberadamente contra el build de producción, no `next dev`: en modo
    // dev, React Refresh usa `eval` para las firmas de Fast Refresh, lo que
    // la CSP de la Fase 12 bloquea y rompe la hidratación por completo. Ese
    // bloqueo NO existe en el bundle de producción (el código de Fast
    // Refresh se elimina en el build) — probar contra `dev` daría falsos
    // positivos sobre un problema que no existe en producción.
    command: "pnpm build && pnpm start -p 3200",
    url: "http://localhost:3200",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
