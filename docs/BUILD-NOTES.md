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
