/**
 * Marcador temporal para rutas que ya existen en la navegación pero cuyo
 * contenido llega en una fase posterior.
 *
 * ⚠️ Toda página que use esto debe llevar `robots: { index: false }` en su
 * metadata — indexar una página "Próximamente" perjudica el dominio, y en un
 * sitio de salud (YMYL) el castigo es mayor. Quitar el noindex al poblarla.
 */
export function PagePlaceholder({
  title,
  intro,
  phase,
}: {
  title: string;
  intro: string;
  phase: string;
}) {
  return (
    <main className="mx-auto min-h-[60vh] max-w-[1200px] px-6 py-24">
      <h1 className="text-display">{title}</h1>
      <p className="mt-4 text-body-lg text-muted">{intro}</p>
      <p className="mt-16 text-sm text-muted">
        Contenido pendiente · {phase} (ver BLUEPRINT.md §9)
      </p>
    </main>
  );
}
