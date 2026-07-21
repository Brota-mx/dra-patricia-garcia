# Notas de build — Dra. Patricia García

Hallazgos, decisiones de implementación y bloqueadores encontrados durante el build.
El plan vive en [`BLUEPRINT.md`](../BLUEPRINT.md).

---

## Fase 0 · Scaffold (2026-07-21)

**Estado:** ✅ completa. `pnpm build` en verde, SSG generando `/es` y `/en`, `pnpm audit` sin
vulnerabilidades.

### Hallazgos

- **El nombre de la carpeta bloquea `create-next-app`.** `Lucrecia` tiene mayúscula y npm no permite
  mayúsculas en el nombre del paquete. Se generó el scaffold en un directorio temporal con el nombre
  `dra-patricia-garcia` y se movió el contenido. El `package.json` quedó con el nombre correcto.
- **`node_modules` no sobrevive a un `mv` entre directorios con pnpm.** Los symlinks del virtual
  store quedan apuntando al origen (`ERR_PNPM_UNEXPECTED_VIRTUAL_STORE`). Se borró y se reinstaló.
- **`next-sanity@13` exige Next ≥16.** Como el blueprint fija la línea 15 (lección de Pagaza: no
  saltar de major por inercia), se instaló **`next-sanity@11.6.13`**, la última compatible con
  Next 15.1+ y React 19. Arrastra `sanity@4` y `styled-components@6` como peers.
- **El middleware va en `src/middleware.ts`, no en la raíz.** Con `src/` directory, Next ignora
  silenciosamente `middleware.ts` de la raíz: `/` devolvía 404 en vez de redirigir a `/es`. Tras
  moverlo, `/` → 307 → `/es`. **No es un error visible en build** — solo se detecta probando la ruta.
- **pnpm es 10.33.2, no v11** (el plan de Pagaza asumía v11). Los `overrides` y
  `onlyBuiltDependencies` van en `package.json` bajo la llave `pnpm`, no en `pnpm-workspace.yaml`.

### Seguridad — auditoría inicial

`pnpm audit` arrancó con **6 vulnerabilidades (2 high, 4 moderate)**, todas transitivas de Sanity.
Resueltas con overrides quirúrgicos en `package.json`:

| Paquete | Vía | Fix |
|---|---|---|
| `js-yaml` (high + 2 moderate) | `sanity > preferred-pm > which-pm > load-yaml-file` | `js-yaml@3` → `^3.15.0` |
| `adm-zip` (high) | `sanity > @sanity/cli > @sanity/runtime-cli` | `>=0.6.0` |
| `postcss` (moderate) | `next > postcss` | `>=8.5.10` — mismo que Pagaza |
| `uuid` (moderate) | `next-sanity > @sanity/preview-url-secret > @sanity/uuid@3.0.2` | `@sanity/uuid` → `^3.0.3` |

**Nota sobre `uuid`:** el override directo a `uuid` no aplicaba porque el árbol tiene tres versiones
(8.3.2, 11.1.1, 13.0.2) y la vulnerable era la 8.3.2 arrastrada por `@sanity/uuid@3.0.2`. Forzar
`uuid@8 → 11` habría cruzado tres majors (v9 cambió a exports nombrados). Se forzó el **paquete padre**
a `@sanity/uuid@3.0.3`, que ya depende de `uuid@11.1.1`. Resultado: **0 vulnerabilidades**.

### Pendiente conocido (no bloquea)

- Peer no resuelto interno de Sanity: `@portabletext/editor@3.3.19` pide
  `@portabletext/sanity-bridge@^1.2.14` y encuentra `3.2.2`. Es interno de `sanity@4.22.0` y no
  rompe build ni typecheck. Vigilar si aparecen errores al montar el Studio en la Fase 9.
- Fuentes: se usa `next/font/google` para Jost e Inter. Next las descarga y auto-hospeda en build,
  así que no hay petición a Google en runtime ni parpadeo — cumple la intención del blueprint sin
  necesidad de gestionar archivos `.woff2` a mano.
- `public/` quedó sin `logo.svg`. **TODO(cliente):** pedir el logo vectorial; hoy solo existe el JPG
  de 29 KB en `work/`.

---

## Fase 1 · Sistema de diseño (2026-07-21)

**Estado:** ✅ completa. Contraste, typecheck, lint y build en verde. Verificado en el navegador
contra estilos computados reales.

### 🔴 Hallazgo importante: el acento de marca no era legible

El blueprint estimaba el contraste de `malva #9C6B8E` sobre `bone #FAF7F4` en **≈4.6:1** y lo
declaraba apto para texto ≥18px. **Medido, da 4.01:1** — y el umbral de "texto grande" en WCAG no es
18px sino **24px** (18pt), o 18.66px en negrita. Es decir: el acento de marca **no servía para texto
de cuerpo ni para botones**, que era justo su uso principal.

**Solución:** se separó el acento en dos tokens.

| Token | Hex | Contraste sobre bone | Uso |
|---|---|---|---|
| `malva` | `#9C6B8E` | 4.01:1 | **Decorativo**: iconos, bordes, títulos ≥24px |
| `malva-deep` | `#8A5A7C` | **5.13:1** | **Legible**: enlaces, texto de acento, botones sólidos |

`malva-deep` además da **5.48:1** con texto blanco encima, así que el botón primario cumple AA sin
concesiones.

**Lección:** no estimar contraste a ojo ni confiar en el número escrito en un brief. Por eso ahora
existe `pnpm check:contrast` (`scripts/check-contrast.mjs`), que valida los 10 pares críticos y
**sale con código 1** si alguno cae por debajo del umbral. Cualquier cambio de paleta pasa por ahí.

### Entregables

- Tokens completos en `globals.css` con `@theme`: color, escala tipográfica semántica
  (`display-xl`/`display`/`heading`/`subheading`/`title`/`body-lg`), radio y sombra.
- `next/font` cargando **Jost** (títulos, empata la geométrica del logo) e **Inter** (cuerpo).
  Verificado en el navegador: `font-family` computada es `Jost`/`Inter`, no fallback.
- Componentes `ui/`: `Button` (3 variantes × 3 tamaños, renderiza `<a>` o `<button>` según `href`),
  `Card`, `Badge`, `Prose`.
- Estilo de foco visible global (`:focus-visible`) — a11y desde el día 1, no parcheado al final.
- Página interna de referencia en `/[locale]/design-system` con `robots: noindex`.
  **TODO(go-live):** decidir si se elimina o se bloquea.

### Verificación en navegador

Estilos computados confirmados sobre el render real: botón primario `rgb(138,90,124)` = `#8A5A7C`
con texto blanco, altura 44px; `h1` en Jost 40px/600; `body` en Inter sobre `rgb(250,247,244)`.
Cero errores de consola. Las 4 rutas (`/es`, `/en`, y ambas `design-system`) responden 200.
