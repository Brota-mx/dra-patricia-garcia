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

---

## Fase 5 · Servicios (2026-07-21)

**Estado:** ✅ completa. Build, typecheck, lint y contraste en verde. Guardia de publicación
verificada en runtime.

### La guardia legal, funcionando de verdad

`generateStaticParams` sólo genera rutas para servicios que pasan `isPublishable()`. Resultado del
build:

```
● /[locale]/servicios/[slug]
  ├ /es/servicios/medicina-general
  ├ /es/servicios/cuidado-de-la-piel
  ├ /en/services/general-medicine
  └ /en/services/medical-grade-skincare
```

**Los tres procedimientos estéticos no generaron ruta.** Verificado con curl:

| Ruta | Estado | Motivo |
|---|---|---|
| `/es/servicios/medicina-general` | 200 | No es embellecimiento: no le aplica el art. 65 |
| `/en/services/general-medicine` | 200 | ídem |
| `/es/servicios/relleno-de-labios` | **404** | `disclosure` en `null` |
| `/en/services/lip-filler` | **404** | ídem |
| `/es/servicios/toxina-botulinica` | **404** | ídem |

No es un bug: es el art. 65 fr. II y III del RLGSMP aplicado por el compilador. En cuanto la doctora
entregue riesgos, contraindicaciones y efectos secundarios, las rutas aparecen solas.

El índice sí lista los cinco servicios (con su descripción y CTA de WhatsApp), pero **sólo enlaza al
detalle los publicables** — enlazar a un 404 sería peor.

🟠 **Pregunta abierta para el abogado:** si mencionar un procedimiento estético en el índice ya
constituye publicidad sujeta al art. 65, el índice también tendría que llevar la divulgación. La
lectura aplicada es que la divulgación corresponde a la página del procedimiento. Confirmar antes
del go-live.

### La divulgación obligatoria como sección, no como disclaimer

`MandatoryDisclosureSection` renderiza riesgos, contraindicaciones y efectos secundarios en tres
columnas, **visible y sin colapsar**, y **arriba del CTA**. El art. 65 exige que sea "de manera
clara": un acordeón cerrado por defecto no lo es.

Bonus no obvio: incluir los riesgos **sube** el E-E-A-T. Ocultarlos es señal de contenido comercial
de baja calidad para los evaluadores de Google, y el paciente informado desconfía de quien no los
menciona.

### Hallazgo de tipos: rutas dinámicas contaminan las firmas

Al registrar `"/servicios/[slug]"` en los `pathnames` de next-intl, el tipo `AppPathname` pasó a
incluirla — y rompió **6 archivos** (`Header`, `Footer`, `sitemap`, `lib/seo`, `navigation`), porque
todos aceptaban `AppPathname` como string simple y una ruta con segmento dinámico exige
`{ pathname, params }`.

Solución: separar los dos tipos.

```ts
export type AppPathname = keyof typeof routing.pathnames;
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;
```

`StaticPathname` es lo que aceptan la navegación, el sitemap y `buildAlternates`. Ahora es
**imposible** pasar una ruta dinámica sin sus params a un `Link` — el error salió en typecheck, no
en un 404 de producción.

---

## Fase 6 · Sobre mí (2026-07-21)

**Estado:** ✅ completa en estructura. **Bloqueada por datos del cliente** para cumplir su función.

Es la página que más pesa para SEO en salud: Google trata la salud como YMYL y exige señales de
autoridad verificables. Y hay obligación legal — el art. 83 LGS y el art. 19 RLGSMP exigen expresar
en la publicidad la institución que expidió el título y el número de cédula profesional.

### La decisión de diseño: verificable, no afirmado

La diferencia entre "médica certificada" y una cédula con enlace al **Registro Nacional de
Profesionistas** es la diferencia entre una afirmación y una verificación. Es de las señales de
confianza más baratas que existen y casi ningún competidor local la usa.

Implementado: cuando llegue la cédula, aparece el badge **y** el enlace de verificación con el texto
*"te invito a hacerlo — con la mía y con la de cualquier persona que te vaya a inyectar"*.

### Bloque para pacientes internacionales — no es traducción

El lector de EE.UU. o Canadá **no puede mapear la cédula mexicana a "board-certified"**, y esa
incertidumbre genera desconfianza por defecto, no por sospecha. Así que la versión en inglés tiene
un bloque propio que explica qué es la cédula y que es públicamente verificable. La investigación de
pacientes lo señaló como la hipótesis más frágil del proyecto.

### Precisión de credenciales que no se puede relajar

⚠️ **"Medicina estética" no es especialidad reconocida por CONACEM.** Si la doctora es Médico
Cirujano con diplomados, el sitio debe decir exactamente eso. Escribir "especialista en medicina
estética" sin cédula de especialidad es exposición legal *y* degrada el E-E-A-T en cuanto alguien lo
contrasta. Por eso `practitioner.title` dice "Médica Cirujana" y el campo `training` está separado.

### Los huecos se declaran, no se rellenan

| Falta | Qué muestra |
|---|---|
| Retrato profesional | Marco punteado con "Fotografía profesional pendiente" — **nunca stock**. En Pagaza la ausencia del retrato del socio fue la fuga de conversión #1, y el 92% de los pacientes lee la bio antes de agendar |
| Cédula | "Cédula profesional pendiente de publicar". El badge y el enlace de verificación aparecen solos cuando llegue |
| Diplomados | La sección entera no se renderiza |

### Verificado en producción

`/es/sobre-mi` y `/en/about` → 200, **sin `noindex`** (se quitó el de la Fase 2, debe indexarse),
JSON-LD `Physician` con `alumniOf` y `sameAs` al Instagram, y sitemap con las 3 rutas que ya tienen
contenido real.

---

## Fase 8 · Contacto (2026-07-21)

**Estado:** ✅ completa y funcional. Único endpoint dinámico del sitio.

### Fail-closed de verdad, no solo documentado

`POST /api/contact` exige las tres integraciones (Resend, Upstash, Turnstile) presentes o responde
**503** sin intentar nada — es la regla de CLAUDE.md "Variables de entorno" llevada a código, no solo
a un comentario. Se verificó en vivo: sin `.env.local`, el endpoint devuelve 503 real.

### El formulario nunca pregunta por salud

El desplegable "¿Qué te interesa?" ofrece opciones genéricas (medicina general, cuidado de la piel,
otro) — nunca síntomas. El mensaje libre tiene tope de 300 caracteres con microcopy explícito
pidiendo no incluir detalles clínicos. Es la regla no negociable 4 de CLAUDE.md aplicada al único
punto del sitio que captura datos de un visitante.

Las opciones del desplegable además siguen la misma guardia legal que ya existe para las páginas de
servicio: sólo aparecen los servicios `isPublishable()` (medicina general, cuidado de la piel) más
"otro". Los tres procedimientos estéticos sin divulgación obligatoria no se ofrecen como motivo de
contacto, por la misma razón que no tienen página propia todavía.

### Texto plano, no HTML — la inyección deja de ser un problema

El correo se envía con `resend.emails.send({ text: ... })`, nunca `html`. Nada de lo que escribe un
visitante se interpreta como marcado en ningún punto del flujo (ni en el correo, ni en la respuesta
JSON, que nunca hace eco del input). Probado con `<script>`/`<img onerror>` en nombre y mensaje: pasa
la validación sin rechazarse — no hace falta sanear lo que nunca se renderiza.

### El honeypot no delata su propia existencia

Un bot que rellena el campo oculto `company` recibe el mismo `200 { ok: true }` que un envío real —
nunca un error distinto. Delatar la trampa en el cuerpo de la respuesta le enseñaría al bot a
evitarla.

### Gotcha de tipos: `z.input` vs `z.infer` con React Hook Form + Zod v4

`zodResolver` espera el tipo de **entrada** del schema (lo que vive en los campos del formulario
antes de validar), no el de **salida**. Con un campo opcional simple esto no importa porque ambos
coinciden — pero en cuanto el schema tiene un `.transform()` o un `.default()`, entrada y salida
divergen (uno los marca opcionales, el otro los vuelve requeridos-con-valor), y TypeScript rechaza el
resolver con un error de tipos que no deja claro la causa real.

Solución: `useForm<T>()` debe tipar con `z.input<typeof schema>`, no `z.infer<typeof schema>`.
Aprendizaje replicable a cualquier formulario RHF + Zod del stack de Brota.

### CVE de `sharp` resuelto con override, no con `--force`

Durante esta fase apareció una alerta **alta** (CVE-2026-33327 y relacionados) en `sharp`, dependencia
opcional de `next` para optimización de imágenes — nada que ver con el código de esta fase, pero la
regla 9 de CLAUDE.md aplica a cualquier alerta que aparezca, no sólo a las que introduce el cambio en
curso. Se fijó `sharp@^0.35.3` (última patch de la línea parcheada) en `pnpm.overrides` → `pnpm audit`
vuelve a dar **0 vulnerabilidades**.

### Qué se verificó y qué queda pendiente de credenciales reales

Sin cuenta real de Resend/Upstash/Turnstile en este entorno, se probaron 8 casos contra el endpoint
real (7 en vivo contra el servidor de desarrollo, 1 contra el endpoint público de Cloudflare con sus
llaves de prueba oficiales):

1. Variables de entorno ausentes → **503**
2. JSON malformado → **400** `invalid_json`
3. Campos vacíos/inválidos → **400** `invalid_input` con el listado exacto de campos
4. Payload de 20 KB → **413** `payload_too_large`
5. Honeypot relleno → **200** `{ ok: true }` falso, sin intentar nada más
6. `<script>`/`<img onerror>` en nombre y mensaje → pasa la validación, no se rechaza ni se renderiza
7. Turnstile con secreto de prueba "siempre pasa" (`1x0000...AA`) → `success: true` contra la API real
8. Turnstile con secreto de prueba "siempre falla" (`2x0000...AA`) → `success: false` contra la API real

**Pendiente de verificar con credenciales reales** (Jesús, al configurar Resend/Upstash en Vercel):
límite de tasa alcanzado (**429** tras 4 envíos en 10 min) y envío real de correo de punta a punta
(**200** con el correo efectivamente recibido en `CONTACT_TO_EMAIL`).

---

## Fase 9 · Blog con Sanity (2026-07-21)

**Estado:** ✅ código y Studio completos y funcionales. **Sin cuenta real de Sanity** (pendiente de
crear — ver Estado - Patricia Garcia.md), así que el blog corre en modo degradado: build en verde,
`/blog` muestra el estado vacío, `/studio` sirve pero no puede conectar. Todo queda listo para que,
en cuanto Jesús cree la cuenta y cargue las credenciales, el blog funcione sin tocar código.

### Modelo bilingüe: localeString/localeSlug/localeBlockContent

Igual que `content/services.ts` en el sitio, cada campo visible del post vive en `{es, en}` — nunca
un solo idioma con fallback. Se definieron 3 tipos de objeto reutilizables en
`sanity/schemas/objects/` (`localeString`, `localeText`, `localeSlug`, `localeBlockContent`) en vez de
duplicar la validación en cada campo. `localeSlug` replica el patrón de slugs traducidos de
`i18n/routing.ts`: un mismo artículo puede vivir en `/es/blog/mito-vs-realidad...` y
`/en/blog/myth-vs-reality...`, y el GROQ de `lib/sanity.ts` filtra por `slug[$locale]` — un artículo
sin traducción completa en un idioma simplemente no aparece en ese idioma (mismo principio que
`isPublishable()` en types/content.ts).

### Fail-closed suave, no fail-closed duro

A diferencia de `/api/contact` (503 real sin credenciales, porque ahí hay un envío que puede fallar a
medias), el blog es contenido estático de lectura: sin `NEXT_PUBLIC_SANITY_PROJECT_ID`/`_DATASET`,
`getSanityClient()` devuelve `null` y todo lector (`getPosts`, `getPostBySlug`, `getPostSlugs`) cae a
`[]`/`null` en vez de tronar. El build entero (`pnpm build`) pasa sin cuenta real — verificado.

### `/blog` decide su propio `noindex`, igual que los servicios estéticos

En vez de un TODO manual para quitar el `noindex` cuando haya contenido, `generateMetadata` calcula
`robots: { index: posts.length > 0, follow: true }` en cada request — un sitio de salud (YMYL) no
gana nada indexando una sección vacía. El sitemap sigue el mismo criterio: sin posts, `/blog` ni
siquiera aparece en `sitemap.xml` (mismo principio que los procedimientos estéticos sin divulgación:
no se indexa lo que no tiene contenido real). En cuanto haya al menos un artículo, ambos se activan
solos.

### El Studio necesita su propio `<html>` — es la única excepción a la regla de CLAUDE.md

`src/app/studio/layout.tsx` renderiza `<html>/<body>` propios, fuera de `[locale]`. La regla "sólo
`[locale]/layout.tsx` renderiza `<html>`" es sobre las rutas del sitio público (next-intl v4 lo exige);
el Studio es un documento HTML completamente aparte, sin i18n ni Header/Footer. El middleware ya
excluía `studio` en su matcher desde la Fase 0 — se scaffoldeó anticipando esta fase.

Con `NEXT_PUBLIC_SANITY_PROJECT_ID` vacío, `sanity.config.ts` usa un `projectId` placeholder con
formato válido (`"placeholder"`) para que `defineConfig()` no truene en build — Sanity valida el
*formato* del ID inmediatamente, no si el proyecto existe. Verificado en `pnpm dev`: `/studio` sirve
200, muestra la pantalla nativa de Sanity "Connect this studio to your project" (el `CorsOriginError`
en consola es del intento fallido de autenticar contra un proyecto que no existe — capturado por el
`ErrorBoundary` de Sanity, no rompe la página). Se resuelve solo con credenciales reales.

### 🔴 Bug de dependencias en `sanity@4.22.0`, no en nuestro código

El build falló al agregar `/studio` con un error de webpack:
`'compileSchemaDefinitionToPortableTextMemberSchemaTypes' is not exported from '@portabletext/sanity-bridge'`.
No es un error del código de esta fase: `sanity@4.22.0` depende de `@portabletext/editor@3.3.19`, que
declara `peerDependency: @portabletext/sanity-bridge@^1.2.14` — pero el árbol de pnpm resolvía
`3.2.2` para satisfacerlo (otro paquete del propio `sanity` pide `^3.2.0`), y esa versión no expone
las funciones que `@portabletext/editor` necesita. Es la última versión estable de la línea 4.x
(`4.22.0` — Sanity ya publica 6.x en release estable), así que no había patch que lo arreglara.
**Solución:** `pnpm.overrides` fijando `"@portabletext/sanity-bridge": "1.2.14"` en todo el árbol —
mismo principio que el override de `sharp` en la Fase 8: cuando el conflicto es de versiones internas
de un paquete, se fuerza la versión compatible en vez de esperar a que el mantenedor lo arregle.
`pnpm audit` sigue en **0 vulnerabilidades** tras el cambio.

### Portable Text: `next-sanity` ya re-exporta `@portabletext/react`

No hizo falta agregar `@portabletext/react` como dependencia directa: `next-sanity@11.6.13` hace
`export * from "@portabletext/react"`, así que `PortableText` y el tipo `PortableTextComponents` se
importan directo de `"next-sanity"`. Sí se agregó `@portabletext/types` como dependencia directa
(antes sólo transitiva) porque se usa su tipo `PortableTextBlock` en `types/blog.ts` — bajo pnpm
estricto, un tipo transitivo no es importable desde el código propio sin declararlo.

### Portadas y foto de autor: `null` hasta que se suba el asset real

`coverImage` es requerido en el schema de Studio (bloquea publicar sin portada), pero el tipo
`PostSummary.coverImage` en el código es `(BlogImage & { alt }) | null` — mismo principio de
"omitir, nunca inventar" que el resto del sitio. `scripts/seed-sanity.mjs` siembra los 6 artículos
**sin** `coverImage` (subir una imagen por API requiere `client.assets.upload()` con el archivo real,
no algo que se pueda sembrar a mano) y lo deja como `TODO(cliente)` explícito en el propio script.

### Contenido sembrado: 6 artículos, escritos — no reciclados de IG

🔴 **No se pudo iniciar sesión en Instagram** (fuera de alcance, igual que en la Fase 0) para tomar los
captions reales de @doctorapatga y reescribirlos. `scripts/seed-sanity.mjs` siembra 6 artículos
**originales** sobre los mismos temas que ya sostienen el resto del sitio (mito vs. realidad de
relleno de labios, qué esperar en la primera valoración de toxina botulínica, skin boosters
explicados, protector solar mineral en cenotes, cuándo ver a un médico general como turista/expat, y
un mito vs. realidad general de medicina estética) — con la misma guardia de cumplimiento que
`content/services.ts` (cero verbos terapéuticos, cero marcas, cero promesas de resultado). El script
es idempotente (IDs fijos, `createOrReplace`) y requiere `SANITY_API_WRITE_TOKEN` sólo en local:

```
node --env-file=.env.local scripts/seed-sanity.mjs
```

**Pendiente antes de publicar de verdad:** revisar estos 6 contra los posts reales de mejor
desempeño del feed cuando la doctora dé acceso, y subir una portada por artículo desde `/studio`.

### Slugs de artículo en el sitemap: agrupados por `_id`, no por idioma

Un mismo post puede tener slug distinto por idioma (`localeSlug`), igual que los servicios. El
sitemap agrupa por `_id` de Sanity para que el `hreflang` de cada artículo apunte a la URL traducida
real — la misma lógica que ya resolvió `buildAlternates()` para rutas estáticas, extendida a
contenido dinámico.

## Fase 10 · Legal (2026-07-21)

### Aviso de Privacidad real, fundamentado en la LFPDPPP vigente (no la de 2010)

El texto vive en `src/content/legalNotice.ts` (secciones tipadas, bilingües) y se renderiza en
`app/[locale]/aviso-de-privacidad/page.tsx`, que reemplaza el `PagePlaceholder` de la Fase 0. Se quitó
el `noindex`: es texto legal público, no una página "próximamente". Fundamentado en
`docs/investigacion/compliance-publicidad.md` — identidad del responsable (nombre, especialidad,
Cofepris), qué datos se recaban (sin datos sensibles), finalidades, encargados (Resend y Vercel, sin
que constituya transferencia), ejercicio de derechos por WhatsApp/formulario, y la autoridad correcta
(Secretaría Anticorrupción y Buen Gobierno — el INAI desapareció con la ley de 2010, abrogada).

🔴 **Esto no es asesoría legal.** El propio archivo de contenido lo señala: antes de ir a producción
un abogado debe revisar el texto, en particular en cuanto llegue el domicilio completo del
consultorio (hoy `clinic.address` es `null`; la sección de identidad se remite a WhatsApp con el
mismo patrón de "omitir, nunca inventar" del resto del sitio).

### Bug de zona horaria en la fecha de "última actualización"

`new Date("2026-07-21")` se interpreta como medianoche UTC. Formatear esa fecha en **cualquier** huso
horario detrás de UTC —incluido `America/Cancun`, el del consultorio— la corre un día hacia atrás
("20 de julio" en vez de "21"). Detectado al verificar la página en el navegador antes de dar la fase
por cerrada. Solución: forzar `timeZone: "UTC"` en `toLocaleDateString()`, porque la fuente es una
fecha calendario sin hora, no un instante real que deba convertirse al huso del lector.

### Footer: cédula/responsable sanitario visibles en las 5 rutas del sitio

El art. 83 LGS y el art. 19 RLGSMP exigen expresar en la publicidad la institución que expidió el
título y quién es responsable sanitario — y debe ir visible, no escondido en una subpágina. El footer
ya mostraba Cofepris e IPN desde la Fase 2; se agregó el título profesional (`practitioner.title`) y
una línea "Responsable sanitario". La cédula profesional sigue pendiente (`practitioner.license` es
`null`, TODO(cliente)) y aparecerá sola cuando llegue el dato, mismo patrón que en `/sobre-mi`.

### Revisión de claims: sin hallazgos nuevos

Se corrió una búsqueda dirigida (verbos terapéuticos, superlativos, promesas de resultado, marcas de
medicamento) sobre todo `src/content`, `src/messages` y `src/components`. Los únicos resultados fueron
los propios comentarios de `content/services.ts` que documentan la regla — el copy ya cumplía desde
la Fase 3/5, cuando se redactó siguiendo `docs/investigacion/compliance-publicidad.md` desde el
origen. El aviso médico en artículos del blog (`blogPage.medicalDisclaimer`) y la divulgación
obligatoria en servicios estéticos (`MandatoryDisclosureSection`) ya estaban resueltos en Fases 5 y 9.

`pnpm build/typecheck/lint/audit/check:contrast` en verde.
