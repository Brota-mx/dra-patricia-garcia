import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Recibe los reportes de violación de CSP que manda el navegador
 * (`report-uri` en next.config.ts) y los deja en los logs de Vercel.
 *
 * Sin destino externo a propósito: este proyecto es standalone de Brota Mx,
 * sin Torre de Control (exclusiva de Grupo Galarza) ni otro servicio de
 * observabilidad contratado todavía.
 */
export async function POST(req: NextRequest) {
  try {
    const report = await req.json();
    console.error("[csp-report]", JSON.stringify(report));
  } catch {
    // Reporte malformado — no hay nada que loguear ni que responder distinto.
  }

  return new NextResponse(null, { status: 204 });
}
