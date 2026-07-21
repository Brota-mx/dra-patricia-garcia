/**
 * Verificador de contraste WCAG 2.1 para los tokens de marca.
 *
 * Corre con: pnpm check:contrast
 *
 * Existe porque estimar contraste "a ojo" falla: el malva original se estimó
 * en 4.6:1 y en realidad daba 4.0:1 — insuficiente para texto normal.
 * Cualquier cambio de paleta debe pasar por aquí.
 *
 * Umbrales WCAG 2.1 AA:
 *   - Texto normal:  4.5:1
 *   - Texto grande:  3:1  (>=24px, o >=18.66px en negrita)
 *   - Componentes UI y gráficos: 3:1
 */

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const relativeLuminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (l1 + 0.05) / (l2 + 0.05);
};

const tokens = {
  ink: "#14110F",
  bone: "#FAF7F4",
  surface: "#FFFFFF",
  malva: "#9C6B8E",
  malvaDeep: "#8A5A7C",
  malvaSoft: "#EFE2EA",
  muted: "#6B625C",
  line: "#E5DED8",
  success: "#2F7A5B",
  destructive: "#B3261E",
};

/** [nombre, primerPlano, fondo, umbral, nota] */
const checks = [
  ["Cuerpo de texto", tokens.ink, tokens.bone, 4.5, "el par más usado del sitio"],
  ["Texto sobre tarjeta", tokens.ink, tokens.surface, 4.5, ""],
  ["Texto secundario", tokens.muted, tokens.bone, 4.5, ""],
  ["Texto sobre acento suave", tokens.ink, tokens.malvaSoft, 4.5, ""],
  ["Enlace / texto de acento", tokens.malvaDeep, tokens.bone, 4.5, "usar malvaDeep, NO malva"],
  ["Botón sólido (texto blanco)", tokens.surface, tokens.malvaDeep, 4.5, ""],
  ["Mensaje de éxito", tokens.success, tokens.bone, 4.5, ""],
  ["Mensaje de error", tokens.destructive, tokens.bone, 4.5, ""],
  ["Acento decorativo (iconos, bordes)", tokens.malva, tokens.bone, 3, "componente UI, no texto"],
  ["Título grande en acento", tokens.malva, tokens.bone, 3, "solo >=24px"],
];

let failed = 0;
console.log("\n  Contraste WCAG 2.1 AA — tokens de marca\n");

for (const [name, fg, bg, threshold, note] of checks) {
  const ratio = contrast(fg, bg);
  const pass = ratio >= threshold;
  if (!pass) failed++;
  const icon = pass ? "PASS" : "FAIL";
  const detail = note ? `  (${note})` : "";
  console.log(
    `  [${icon}] ${name.padEnd(36)} ${ratio.toFixed(2)}:1  (min ${threshold})${detail}`,
  );
}

console.log("");
if (failed > 0) {
  console.error(`  ${failed} par(es) por debajo del umbral AA.\n`);
  process.exit(1);
}
console.log("  Todos los pares cumplen AA.\n");
