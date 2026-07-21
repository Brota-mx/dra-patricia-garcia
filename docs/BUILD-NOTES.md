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

---

## Fase 2 · Layout + SEO base (2026-07-21)

**Estado:** ✅ completa. Build, typecheck, lint, contraste y audit en verde. Navegación, i18n y
metadata verificadas en runtime contra el build de producción.

### Decisión: slugs de ruta localizados

El blueprint pedía rutas bilingües, pero servir `/en/servicios` a un lector en inglés desperdicia
la mitad del beneficio de tener el sitio traducido — y el SEO en inglés era una de las razones para
hacerlo bilingüe. Se configuraron `pathnames` en `defineRouting`:

| Interno (carpeta) | ES | EN |
|---|---|---|
| `/servicios` | `/servicios` | `/services` |
| `/sobre-mi` | `/sobre-mi` | `/about` |
| `/contacto` | `/contacto` | `/contact` |
| `/aviso-de-privacidad` | `/aviso-de-privacidad` | `/privacy-policy` |

La carpeta en `app/[locale]/` siempre usa el slug **español**; next-intl reescribe. Al agregar una
ruta hay que registrarla en `routing.ts` o no existirá su versión traducida.

**Ojo con el listado del build:** muestra las rutas *internas* (`/en/servicios`), no las públicas.
Es engañoso — la traducción la resuelve el middleware en runtime. Verificado con curl:
`/en/services` → 200, `/en/servicios` → 307 (redirige al slug correcto).

### hreflang con slugs traducidos

`lib/seo.ts` → `buildAlternates()` genera canonical + hreflang apuntando a la URL traducida real.
Si el hreflang apuntara a `/en/servicios` (que no existe), Google no emparejaría las versiones.
Verificado en el HTML de producción:

```
/en/services  canonical → /en/services
              hreflang es → /es/servicios
              hreflang en → /en/services
              x-default   → /es/servicios
```

### Rutas marcador con noindex

Se crearon las 5 rutas del blueprint como marcadores para que la navegación funcione completa desde
ahora. **Todas llevan `robots: { index: false, follow: true }`** y un `TODO(Fase N)` para quitarlo:
indexar páginas "Próximamente" daña el dominio, y en salud (YMYL) el castigo es mayor. El
`sitemap.ts` tampoco las lista todavía.

### Trampas encontradas al verificar

- **El scroll programático inyectado no dispara el listener de scroll.** El header parecía roto
  (`window.scrollTo(0,400)` y seguía transparente). No lo estaba: con
  `window.dispatchEvent(new Event('scroll'))` aplicó `backdrop-blur-md bg-bone/90` correctamente.
  **Era el método de prueba, no el código** — un scroll real de usuario sí emite el evento.
- **Un `curl` a un puerto equivocado devolvió el `robots.txt` de otro proyecto** (`Disallow: /api/`,
  `Host:`), lo que hizo parecer que el nuestro estaba mal. Los artefactos reales en
  `.next/server/app/robots.txt.body` eran correctos. **Lección:** al verificar por HTTP, confirmar
  primero que responde el sitio esperado (un `grep` de algo único) antes de creerle al output.
- **`next start` falla si un `next dev` corrió después del build** — el dev sobrescribe `.next` y
  desaparece el build de producción. Hay que rebuildear antes de `start`.

### Verificación de navegación (runtime)

- Cambio de idioma desde la home: `/es` → `/en`, `html lang` actualizado, nav traducido.
- **Cambio de idioma desde ruta interna: `/en/services` → `/es/servicios`**, con `h1` "Servicios" y
  título "Servicios | Dra. Patricia García" (plantilla del layout funcionando).
- Skip link "Saltar al contenido" presente; foco visible global desde la Fase 1.
- `WhatsAppFab` **no se renderiza** sin `NEXT_PUBLIC_WHATSAPP_NUMBER` — comportamiento intencional,
  mejor nada que un enlace roto. Aparecerá cuando el cliente entregue el número.
- Cero errores de consola.

---

## Fase 4 · Home (2026-07-21)

**Estado:** ✅ completa. Build, typecheck, lint y contraste en verde. Verificada en runtime contra
el build de producción, en ambos idiomas.

### Secciones

`Hero` · `CredentialsBand` · `ServicesGrid` · `FAQ` · `LocationMap` · CTA de cierre.

**El Hero dice qué es y con qué criterio, no sólo el nombre de la doctora.** Un hero que sólo repite
el nombre no comunica propuesta — lección directa de la auditoría de Pagaza, donde el hero sin
propuesta fue uno de los hallazgos convergentes.

El párrafo cierra con *"y si algo no es adecuado para ti, te lo digo"*. Es posicionamiento
deliberado: la investigación de pacientes mostró que el mercado se está reconfigurando alrededor del
miedo a sobrellenarse, y que la señal más diferenciadora hoy es la disposición a decir que no.

### Cómo se comporta el contenido que falta

Esto es lo que más importa de la fase: **la home se degrada con dignidad**, no con relleno.

| Dato ausente | Comportamiento |
|---|---|
| Respuestas de FAQ (todas `null`) | La sección FAQ **no se renderiza**. Publicar "Próximamente" bajo una pregunta de seguridad sería peor que no tener la sección |
| `clinic.address` / `geo` | `LocationMap` muestra ciudad + "te comparto la dirección por WhatsApp". No se inventa dirección ni se pinta un mapa genérico |
| `clinic.license` | El badge de cédula simplemente no aparece. En cuanto llegue el dato, aparece solo |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Los CTAs caen a la página de contacto en vez de romperse |

Verificado en el DOM: con todo en `null`, la home renderiza 4 secciones con contenido real y ninguna
con placeholders.

### Detalle corregido durante la verificación

Los CTAs caían a `/contacto` sin prefijo de idioma. Funcionaba por redirección del middleware, pero
sobraba un salto. Ahora reciben `fallbackHref` ya localizado. Verificado: `/es` enlaza a
`/es/contacto` y `/en` a `/en/contact`.

### Verificación bilingüe (build de producción)

```
/es → /es/servicios /es/sobre-mi /es/contacto /es/aviso-de-privacidad /es/blog
/en → /en/services  /en/about    /en/contact  /en/privacy-policy      /en/blog
H1 en inglés: "Aesthetic medicine, with medical judgment"
Servicios: Lip Filler · Botulinum Toxin · Skin Booster · General Medicine Consultation
```

Los nombres en inglés son términos de mercado, no traducciones literales.

### Pendiente de verificar

El acordeón de FAQ **no se ha podido probar interactivamente** porque no hay ninguna pregunta
contestada. Probar navegación por teclado y `aria` en cuanto la doctora entregue respuestas.
