import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

/**
 * Config del Studio, montado en `/studio` (ver src/app/studio).
 *
 * ⚠️ Sin `NEXT_PUBLIC_SANITY_PROJECT_ID`/`_DATASET` reales (cuenta de Sanity
 * de Brota pendiente de crear — ver Estado - Patricia Garcia.md), se usa un
 * placeholder con formato válido para que `defineConfig` no truene en build.
 * El Studio compila y sirve, pero no podrá conectar hasta que Jesús cargue
 * las credenciales reales en `.env.local`/Vercel.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "dra-patricia-garcia",
  title: "Dra. Patricia García — Blog",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
