/**
 * Une clases condicionalmente. Deliberadamente mínimo — no agregamos
 * clsx/tailwind-merge por 4 componentes; las variantes están definidas de
 * forma que no colisionan entre sí.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
