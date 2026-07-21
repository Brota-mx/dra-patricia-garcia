# Dra. Patricia García — Medicina General y Estética · Blueprint

> Generado por The Architect el 2026-07-21
> Arquetipo: **marketing-site** (secundario: content-platform por el blog)
> Cliente de **Brota Mx** · Carpeta local: `Desktop\Brota\Lucrecia`

---

## 1. Panorama del Proyecto

### Visión

Sitio institucional bilingüe (ES/EN) de la **Dra. Patricia García**, médica cirujana egresada del
**Instituto Politécnico Nacional**, con consultorio de **medicina general y medicina estética** en
**Playa del Carmen, Quintana Roo**. Hoy toda su presencia digital vive en Instagram
([@doctorapatga](https://www.instagram.com/doctorapatga/) — 82 publicaciones, 793 seguidores), donde ya
construyó un lenguaje visual propio y una biblioteca de contenido educativo real (mito vs. realidad,
testimonios, antes/después, consejos de cuidado de la piel).

El problema: Instagram es **tierra rentada**. No rankea en Google, no captura al paciente que busca
"botox playa del carmen" a las 11 de la noche, y no comunica autoridad médica a un paciente
extranjero que la está evaluando antes de viajar. El sitio convierte ese capital de contenido en un
activo propio: una casa con SEO local, credenciales verificables (**Cofepris 2623032002A00011**), y
dos caminos de conversión sin fricción — **WhatsApp** para el paciente local y **calendario en línea**
para el que prefiere reservar solo.

Playa del Carmen es la variable que define la estrategia: es un mercado de turismo médico y comunidad
expat. El bilingüe ES/EN no es un adorno — es el acceso a un paciente que paga bien por medicina
estética y que **investiga en inglés antes de decidir**.

### Objetivos

- Convertir tráfico de búsqueda local y de Instagram en **citas agendadas**, por WhatsApp o calendario.
- Establecer **autoridad médica verificable** (E-E-A-T) — requisito duro de Google en salud (YMYL).
- Rankear en búsqueda local para servicios de alto valor en Playa del Carmen, en español e inglés.
- Darle a la doctora **autonomía editorial**: que publique en el blog sin depender de Brota.
- Cumplir la normativa mexicana de datos personales y publicidad de servicios de salud.

### Métricas de Éxito

- **Conversión:** clics a WhatsApp + reservas de Cal.com por sesión (meta inicial: ≥4% de visitantes).
- **SEO:** posicionamiento en top-10 para 5 términos locales prioritarios a 6 meses.
- **Rendimiento:** Lighthouse ≥95 en las cuatro categorías, en móvil.
- **Autonomía:** la doctora publica ≥2 artículos/mes sin intervención de Brota.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js 15.5.x** (App Router, SSG) | Consistencia con todo el ecosistema Brota/Galarza. El arquetipo sugiere Astro, pero necesitamos rutas API para el formulario seguro y el patrón ya está probado en Pagaza. SSG da rendimiento equivalente. **Fijar la última patch de 15.5.x, no saltar a 16** |
| Lenguaje | **TypeScript strict** | Regla no negociable de Brota. Sin `any` |
| Estilos | **Tailwind CSS v4** | Tokens como CSS custom properties, derivados del logo real |
| Componentes | Componentes propios + **Radix UI** para acordeón/diálogo | shadcn/ui completo es exceso para un sitio de 6 rutas. Radix solo donde hace falta accesibilidad de primitiva |
| i18n | **next-intl v4** | Patrón ya resuelto en Pagaza. Solo `app/[locale]/layout.tsx` renderiza `<html>` |
| Contenido estático | **Tipado en `src/content/*`** | Servicios, FAQ y datos del consultorio cambian poco. Cero superficie extra |
| Blog / CMS | **Sanity** (dataset propio de Brota) | La doctora publica sola. Con 82 posts de IG ya demostró que genera contenido — un blog en MDX la volvería dependiente de Brota para cada publicación |
| Formularios | **React Hook Form + Zod** | Validación compartida cliente/servidor |
| Envío de correo | **Resend** | Cuenta de Brota |
| Rate limiting | **Upstash Redis** | Protege `/api/contact` de abuso |
| Anti-bot | **Cloudflare Turnstile** | Sin fricción de CAPTCHA para el paciente |
| Agenda | **Cal.com** (embed) + **WhatsApp** (deep links) | Doble vía: WhatsApp convierte al paciente local, Cal.com profesionaliza y atiende al extranjero en otra zona horaria |
| Analítica | **Vercel Analytics** | Gratis, sin cookies, sin banner de consentimiento |
| Hosting | **Vercel** (Hobby) | Repo **público** en `Brota-mx` — Hobby no despliega repos privados de organización |
| Gestor de paquetes | **pnpm v11** | Estándar de Brota. Los `overrides` van en `pnpm-workspace.yaml`, **no** en `package.json` |

### Decisiones explícitas (y su justificación)

- **Next.js sobre Astro:** el arquetipo recomienda Astro para sitios de marketing, pero elegimos Next
  por consistencia de ecosistema (todo Brota es Next+Vercel), porque necesitamos backend real para el
  formulario, y porque el equipo ya tiene el patrón depurado. SSG cierra la brecha de rendimiento.
- **Sanity sobre MDX:** decisión del cliente. Cuesta una fase extra de build y una cuenta más, pero
  compra autonomía editorial — que es el punto entero de tener blog.
- **Sin base de datos propia:** el sitio no persiste datos de pacientes. Cero superficie SQL, y evita
  convertirse en responsable de un repositorio de datos sensibles de salud.
- **El logo manda sobre el feed:** los tokens salen del **asset real** (`work/*.JPG`), con el
  rosa-malva del feed como acento. Aprendizaje directo de Pagaza, donde se construyó una identidad
  entera desde la descripción escrita de un brief y resultó 0% fiel al logo.

---

## 3. Estructura de Directorios

```
lucrecia/                              # carpeta local; repo: Brota-mx/dra-patricia-garcia
  BLUEPRINT.md                         # este archivo
  CLAUDE.md                            # contexto para Claude Code (sección 15)
  .env.example                         # plantilla de variables — NUNCA con valores reales
  .gitignore                           # incluye work/ (material del cliente)
  pnpm-workspace.yaml                  # allowBuilds (sharp/swc) + overrides de seguridad
  next.config.ts                       # headers de seguridad, CSP, imágenes
  middleware.ts                        # next-intl; matcher excluye /api
  work/                                # 🚫 GITIGNORED — logo, fotos, material del cliente
  docs/
    BUILD-NOTES.md                     # hallazgos y bloqueadores durante el build
    go-live-checklist.md               # pasos de operador antes de publicar
  sanity/
    schemas/
      post.ts                          # artículo del blog (bilingüe)
      author.ts                        # autor (la doctora)
      category.ts                      # categoría del artículo
      index.ts                         # registro de schemas
    sanity.config.ts                   # Studio montado en /studio
  src/
    app/
      [locale]/
        layout.tsx                     # ÚNICO layout que renderiza <html>
        page.tsx                       # Home
        servicios/
          page.tsx                     # índice de servicios
          [slug]/page.tsx              # detalle de servicio (SSG por slug)
        sobre-mi/page.tsx              # E-E-A-T — la página más importante para SEO en salud
        blog/
          page.tsx                     # listado (ISR 3600s)
          [slug]/page.tsx              # artículo
        contacto/page.tsx              # formulario + Cal.com + mapa + WhatsApp
        aviso-de-privacidad/page.tsx   # LFPDPPP — obligatorio
        not-found.tsx
      api/
        contact/route.ts               # ÚNICA pieza dinámica del sitio
      studio/[[...tool]]/page.tsx      # Sanity Studio (protegido por login de Sanity)
      sitemap.ts
      robots.ts
    components/
      layout/
        Header.tsx                     # nav bilingüe, scroll-aware, selector de idioma
        Footer.tsx                     # datos del consultorio, Cofepris, legal
        WhatsAppFab.tsx                # botón flotante persistente
      sections/
        Hero.tsx
        ServicesGrid.tsx
        CredentialsBand.tsx            # IPN + Cofepris + años de práctica
        BeforeAfter.tsx                # 🚩 tras feature flag — ver sección 8
        Testimonials.tsx               # 🚩 tras feature flag
        FAQ.tsx                        # acordeón Radix
        LocationMap.tsx                # mapa estático + cómo llegar
        BookingCTA.tsx                 # WhatsApp + Cal.com lado a lado
      forms/
        ContactForm.tsx                # "use client" — RHF + Zod + Turnstile
      ui/
        Button.tsx  Card.tsx  Badge.tsx  Accordion.tsx  Prose.tsx
    content/
      services.ts                      # servicios tipados, bilingües
      clinic.ts                        # dirección, horarios, WhatsApp, Cofepris
      faq.ts                           # preguntas frecuentes bilingües
    lib/
      sanity.ts                        # cliente + queries GROQ
      resend.ts                        # envío de correo
      ratelimit.ts                     # Upstash
      turnstile.ts                     # verificación server-side
      whatsapp.ts                      # constructor de deep links con mensaje pre-llenado
      seo.ts                           # helpers de metadata + JSON-LD
      reporter.ts                      # reporter fail-open a Torre de Control
      flags.ts                         # feature flags (antes/después)
    types/
      index.ts
    styles/
      globals.css                      # tokens Tailwind v4 (@theme)
    messages/
      es.json                          # UI/chrome en español
      en.json                          # UI/chrome en inglés
  public/
    logo.svg                           # ⚠️ pedir vectorial al cliente; hoy solo hay JPG
    og/                                # imágenes Open Graph por locale
    favicon.svg
  tests/
    e2e/
      navigation.spec.ts
      contact-form.spec.ts
      i18n.spec.ts
```

---

## 4. Modelo de Datos

**No hay base de datos propia.** El sitio es estático salvo el endpoint de contacto. Los únicos datos
estructurados viven en Sanity (contenido editorial, cero datos de pacientes) y en archivos tipados.

### Sanity — `post`

| Campo | Tipo | Notas |
|---|---|---|
| `title` | `{es, en}` localizado | Requerido |
| `slug` | `{es, en}` slug | Único por locale |
| `excerpt` | `{es, en}` texto | ≤160 caracteres — alimenta la meta description |
| `body` | `{es, en}` Portable Text | Cuerpo del artículo |
| `coverImage` | image + `alt` localizado | `alt` **requerido** por accesibilidad |
| `category` | referencia → `category` | |
| `author` | referencia → `author` | Por defecto: la doctora |
| `publishedAt` | datetime | Ordena el listado |
| `seoKeywords` | array de string | Opcional |
| `medicalDisclaimer` | booleano (default `true`) | Inyecta el aviso "esto no sustituye una consulta" |

### Sanity — `author`

| Campo | Tipo | Notas |
|---|---|---|
| `name` | string | "Dra. Patricia García" |
| `credentials` | `{es, en}` texto | Cédula, IPN, Cofepris — **alimenta el E-E-A-T** |
| `photo` | image | |
| `bio` | `{es, en}` Portable Text | |

### Sanity — `category`

| Campo | Tipo | Notas |
|---|---|---|
| `title` | `{es, en}` | Ej. "Medicina estética", "Cuidado de la piel" |
| `slug` | slug | |

### Contenido tipado — `src/content/services.ts`

```typescript
export type Service = {
  slug: string;                          // "diseno-de-labios"
  name:        { es: string; en: string };
  tagline:     { es: string; en: string };
  description: { es: string; en: string };
  benefits:    { es: string[]; en: string[] };
  duration:    { es: string; en: string };  // "45 minutos"
  faq:         Array<{ q: { es: string; en: string }; a: { es: string; en: string } }>;
  whatsappIntent: string;                // mensaje pre-llenado del deep link
  icon: string;
};
```

**Servicios detectados en el feed de Instagram — confirmar con la doctora antes de publicar:**
diseño y relleno de labios · toxina botulínica (bótox) · hidratación labial / skinbooster ·
consulta de medicina general · asesoría y venta de dermocosmética (Colorescience).

> ⚠️ **No inventar precios, indicaciones médicas, ni tiempos de recuperación.** Todo dato clínico debe
> venir de la doctora por escrito. Un dato clínico inventado en un sitio médico es un riesgo real,
> no un detalle de copy.

---

## 5. Diseño de API

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/contact` | Recibe solicitud de contacto → correo vía Resend | No (protegido por Turnstile + rate limit) |

### `POST /api/contact` — detalle

**Request**
```typescript
{
  name: string;            // 2–80 caracteres
  email: string;           // email válido
  phone: string;           // 10–15 dígitos, se normaliza
  // ⚠️ Categoría GENÉRICA, nunca clínica. Una opción como "tratamiento de
  // acné" revelaría estado de salud y activaría el régimen de datos sensibles.
  service: "medicina-general" | "medicina-estetica" | "otro";
  preferredContact: "whatsapp" | "email";
  message?: string;        // ≤300 caracteres, OPCIONAL
  locale: "es" | "en";
  website?: string;        // honeypot — si viene lleno, responder 200 y descartar
  turnstileToken: string;
}
```

**Cadena de validación (en orden, cortocircuito):**
1. Rate limit por IP (Upstash): **5 solicitudes / 10 minutos**.
2. Honeypot — si `website` tiene valor, responder `200` silencioso (no revelar el mecanismo).
3. Verificación de Turnstile contra la API de Cloudflare.
4. Validación Zod del esquema completo.
5. Sanitización — escapar HTML antes de construir el correo.
6. Envío vía Resend al correo del consultorio.
7. Reporte fail-open a Torre de Control (nunca bloquea la respuesta).

**Respuestas:** `200 {ok:true}` · `400 {ok:false, error:"validation", fields:[…]}` ·
`429 {ok:false, error:"rate_limit"}` · `503 {ok:false, error:"unavailable"}` cuando falten secretos
(fail-closed correcto: sin credenciales, el formulario no finge que envió).

> 🔴 **Regla de datos sensibles:** el campo `message` **jamás** debe pedir información clínica. La
> etiqueta correcta es "¿Algo que quieras comentarnos?" — nunca "describe tu padecimiento". Bajo la
> LFPDPPP los datos de salud son **datos personales sensibles** y captarlos por un formulario web
> dispara obligaciones de consentimiento expreso que no queremos asumir. Ver sección 8.
>
> No basta con no preguntarlo: el paciente escribirá su padecimiento de todos modos. Por eso el
> campo lleva **microcopy visible encima** (no tooltip) — *"Por tu privacidad, no incluyas
> información sobre tu salud o padecimientos. Lo revisamos en consulta."* — más límite de 300
> caracteres y política documentada de supresión de lo no solicitado.

---

## 6. Arquitectura Frontend

### Rutas

| Ruta | Página | Qué ve el paciente |
|---|---|---|
| `/[locale]` | Home | Hero con propuesta clara, servicios, credenciales, prueba, ubicación, CTA doble |
| `/[locale]/servicios` | Índice | Rejilla de servicios con descripción corta |
| `/[locale]/servicios/[slug]` | Detalle | Qué es, para quién, duración, FAQ del servicio, CTA |
| `/[locale]/sobre-mi` | Sobre la doctora | Formación IPN, Cofepris, filosofía, foto real, trayectoria |
| `/[locale]/blog` | Listado | Artículos paginados por categoría (ISR 3600s) |
| `/[locale]/blog/[slug]` | Artículo | Cuerpo, autor con credenciales, aviso médico, artículos relacionados |
| `/[locale]/contacto` | Contacto | Cal.com embebido + formulario + mapa + WhatsApp + horarios |
| `/[locale]/aviso-de-privacidad` | Legal | Aviso de Privacidad LFPDPPP |
| `/studio` | Sanity Studio | Panel de la doctora (autenticación de Sanity) |

### Jerarquía de componentes — Home

```
[locale]/page.tsx  (Server Component)
├── Header                     (client — scroll-aware, selector de idioma)
├── Hero                       (server)
│   └── BookingCTA             (client — WhatsApp + Cal.com)
├── CredentialsBand            (server — IPN · Cofepris · años de práctica)
├── ServicesGrid               (server — desde content/services.ts)
├── BeforeAfter                (server — 🚩 solo si FEATURE_BEFORE_AFTER)
├── Testimonials               (server — 🚩 solo si FEATURE_TESTIMONIALS)
├── FAQ                        (client — acordeón Radix)
├── LocationMap                (server — imagen estática + enlace a Maps)
├── Footer                     (server)
└── WhatsAppFab                (client — flotante, presente en todas las rutas)
```

### Estado

Server Components por defecto. `"use client"` solo en: `Header` (scroll + menú móvil),
`ContactForm` (RHF + Turnstile), `FAQ` (acordeón), `BookingCTA` y `WhatsAppFab` (analítica de clic).
Sin librería de estado global — el sitio no la necesita, y meterla sería sobre-ingeniería.

**Estrategia de renderizado:** todo SSG salvo el blog, que usa ISR con `revalidate: 3600` para que la
doctora vea sus publicaciones en producción dentro de la hora sin necesidad de un redeploy.

---

## 7. Sistema de Diseño

> **Origen de los tokens:** muestreados del logo real en `work/` (estetoscopio que forma un tulipán,
> negro sobre blanco, sans-serif geométrica en mayúsculas con tracking abierto) y del feed de
> Instagram (rosa/malva). **El logo manda; el feed aporta el acento.**

### Colores

| Rol | Hex | Uso |
|---|---|---|
| Ink (primario) | `#14110F` | Texto, wordmark, logo, botones primarios |
| Bone (fondo) | `#FAF7F4` | Fondo de página — crema cálido, no blanco clínico |
| Surface | `#FFFFFF` | Tarjetas, paneles |
| Malva (acento) | `#9C6B8E` | CTAs, enlaces, detalles — derivado del rosa/lila del feed |
| Malva suave | `#EFE2EA` | Fondos de acento, estados hover |
| Muted | `#6B625C` | Texto secundario |
| Line | `#E5DED8` | Bordes, divisores |
| Success | `#2F7A5B` | Confirmación de envío |
| Destructive | `#B3261E` | Errores de validación |

> ⚠️ **Contraste:** `Malva #9C6B8E` sobre `Bone` da ≈4.6:1 — válido para texto ≥18px, botones e
> iconos, **no** para texto pequeño. Para cuerpo de texto usar siempre `Ink` o `Muted`. Verificar con
> auditoría antes de cerrar la fase de diseño.

### Tipografía

| Rol | Fuente | Escala | Peso |
|---|---|---|---|
| Display / Títulos | **Jost** | 40 / 32 / 24 / 20 px | 500–600 |
| Cuerpo | **Inter** | 16 px (18 px en artículos) | 400 |
| Eyebrow / etiquetas | **Jost** mayúsculas, `letter-spacing: 0.12em` | 12 px | 500 |

**Jost** es la alternativa libre más cercana a la geométrica del logo (familia Futura). Auto-hospedar
con `next/font/local` — nada de Google Fonts en runtime (evita el parpadeo y una petición externa que
además complicaría la CSP).

### Espaciado y layout

- Base de 4px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`
- Radio: `8px` por defecto, `16px` en tarjetas, `full` en píldoras y avatares
- Ancho máximo de contenido: `1200px`; texto de artículo: `68ch`
- Breakpoints: `sm 640` · `md 768` · `lg 1024` · `xl 1280`

### Estilo

Editorial y respirado, no "spa". Mucho blanco, tipografía grande, sombras casi imperceptibles
(`0 1px 2px rgba(20,17,15,.06)`), bordes de 1px en `Line` en vez de sombras pesadas. Fotografía real
en blanco y negro cálido o con tratamiento suave, jamás stock genérico de mujer sonriendo con toalla.
Animaciones sobrias: `fade-up` de 300ms al entrar en viewport, respetando `prefers-reduced-motion`.

**Diseño móvil primero.** El paciente llega desde el enlace de la bio de Instagram, en un teléfono.

---

## 8. Legal, Privacidad y Cumplimiento

> Esta sección es un **bloqueador de go-live**, no una recomendación. En Pagaza el mismo tema frenó la
> publicación; aquí el riesgo es mayor porque hay datos de salud de por medio.
> **Nada de esto es asesoría legal** — hay que validarlo con un abogado o con quien asesore a la doctora.

> 🔄 **Actualizado 2026-07-21** tras investigación de compliance con fuentes normativas primarias.
> Resumen accionable y fundamentos: `docs/investigacion/compliance-publicidad.md`.

### 8.1 Aviso de Privacidad (LFPDPPP)

⚠️ **La LFPDPPP de 2010 fue abrogada.** Rige la **nueva ley (DOF 20-mar-2025)**; el **INAI
desapareció** y la autoridad es la Secretaría Anticorrupción y Buen Gobierno. Cualquier plantilla
que mencione al INAI está desactualizada.

**Mitigación de diseño (confirmada como correcta):** el formulario **no capta datos de salud**.
Los datos sensibles exigen consentimiento expreso por escrito con firma y sus sanciones se duplican;
al no captarlos, operamos con datos ordinarios y consentimiento tácito válido.

**Dos fugas que el diseño debe cerrar:**
1. El campo "servicio de interés" debe tener opciones **genéricas y no clínicas** — "Medicina
   estética", no "tratamiento de acné". Una opción clínica revela estado de salud.
2. El campo de mensaje libre necesita **microcopy visible**: *"Por tu privacidad, no incluyas
   información sobre tu salud o padecimientos"*, más límite de caracteres y política de supresión.

🔴 **CORRECCIÓN:** este blueprint decía antes que había que declarar una transferencia internacional
por usar Resend. **Es incorrecto.** El art. 3 fr. XX excluye del concepto de transferencia la
comunicación a la **persona encargada**, y Resend y Vercel son encargados (tratan datos por cuenta
de la responsable, sin finalidad propia). Lo exigible es aceptar y archivar sus **DPA** (art. 13),
medidas de seguridad (art. 18) y procedimiento de notificación de vulneraciones (art. 19).

### 8.2 Publicidad de servicios médicos (COFEPRIS)

**Se requieren DOS trámites, no uno.** La exención de "servicios otorgados en forma individual"
existe sólo para servicios de salud (art. 79 fr. I RLGSMP); la fracción VI, embellecimiento, **no la
tiene**. Que la doctora sea persona física no la exime del permiso para la parte estética.

| Sección | Trámite | Costo |
|---|---|---|
| Home, Sobre mí, Contacto, Blog, medicina general | **Aviso** (`COFEPRIS-02-002-A`) | Gratuito |
| Servicios estéticos | **Permiso** (`COFEPRIS-02-001-A`) | Con costo |

⚠️ El aviso se presenta **dentro de los 5 días PREVIOS** a publicar. Y el art. 83 obliga a un trámite
nuevo ante cualquier cambio que varíe las características base del permiso — el contenido comercial
debe ser estable.

**Tres reglas que afectan el código, no sólo el copy:**

1. **Cero verbos terapéuticos** (art. 63 último párrafo): prohibido atribuir cualidades preventivas,
   rehabilitatorias o terapéuticas a procedimientos estéticos. La sustitución: actuar sobre **la
   apariencia de** la condición, nunca sobre la condición. Documentado en `src/content/services.ts`.
2. **Riesgos, contraindicaciones y efectos secundarios son obligatorios y VISIBLES** (art. 65 fr. II
   y III) — no en modal ni acordeón colapsado. Es arquitectura de información. Implementado como
   `MandatoryDisclosure` requerido en el tipo `Service`, con `isPublishable()` como guardia.
3. **Cero marcas** de medicamento o dispositivo (Botox®, Juvederm…): se describe el servicio, no el
   producto.

🟠 **Bloqueante de nomenclatura:** la LGS art. 310 restringe la publicidad de medicamentos de
prescripción a población general. Hay argumento razonable de que anunciar *el servicio* no es
anunciar *el medicamento*, pero debe validarlo un abogado — **antes de que las URLs se indexen**,
porque cambiaría los slugs.

**Antes/después:** además del consentimiento, la NOM-004 num. 5.5 exige **desidentificación** aunque
el paciente autorice, y las imágenes deben someterse dentro del proyecto publicitario. Recomendación:
**no incluirlas en v1**. `BeforeAfter` y `Testimonials` se construyen tras **feature flags apagadas**;
el código queda listo y encenderlas es decisión del cliente con respaldo legal.

**Testimonios:** publicar un testimonio equivale a que el anunciante haga esa afirmación (art. 11), y
hay que poder comprobarla. Solución: testimonios sobre la **experiencia de atención**
("me explicó con calma", "no me sentí presionada"), no sobre resultado clínico.

### 8.3 Aviso médico en el blog

Todo artículo lleva al pie: *"Este contenido es informativo y no sustituye una consulta médica."*
Es lo correcto éticamente y además refuerza el E-E-A-T que Google evalúa en contenido de salud.

---

## 9. Orden de Construcción

> **Sección más crítica del blueprint.** Una rama por fase, verificada (build + preview de Vercel en
> verde + tests) antes de mergear. **El merge lo autoriza Jesús** salvo instrucción explícita.

**Fase 0 · Scaffold**
`pnpm create next-app@latest` (TS, App Router, Tailwind, alias `@/`). Fijar Next a la última 15.5.x.
Crear `pnpm-workspace.yaml` con `allowBuilds` para sharp/swc. Configurar next-intl con `[locale]` y
middleware que excluya `/api`. Estructura de carpetas completa. `git init`, rama `main`.
**Entregable:** `pnpm dev` levanta una home vacía en `/es` y `/en`.

**Fase 1 · Sistema de diseño**
Tokens de la sección 7 en `globals.css` con `@theme` de Tailwind v4. Auto-hospedar Jost e Inter con
`next/font/local`. Componentes `ui/`: Button, Card, Badge, Prose. Verificar contraste AA.
**Entregable:** página de muestra con todos los tokens y componentes.

**Fase 2 · Layout + SEO base**
Header bilingüe scroll-aware con selector de idioma, Footer con datos del consultorio y Cofepris,
WhatsAppFab. Metadata por locale, `hreflang`, `sitemap.ts`, `robots.ts`.
**Entregable:** navegación completa funcionando en ambos idiomas.

**Fase 3 · Contenido tipado**
Poblar `content/services.ts`, `content/clinic.ts`, `content/faq.ts` y `messages/{es,en}.json`.
Traducción al inglés con criterio médico — **no traducción literal**; los nombres comerciales de
procedimientos difieren entre mercados ("diseño de labios" → "lip filler", no "lip design").
**Entregable:** todo el contenido disponible y tipado, sin UI todavía.

**Fase 4 · Home**
Hero (propuesta clara: qué hace, para quién, dónde), CredentialsBand, ServicesGrid, FAQ,
LocationMap, BookingCTA.
**Entregable:** home completa y responsiva en ambos idiomas.

**Fase 5 · Servicios**
Índice + detalle SSG por slug, con FAQ por servicio y CTA de WhatsApp con mensaje pre-llenado.
**Entregable:** una ruta por servicio, generada estáticamente.

**Fase 6 · Sobre mí** ← *la página que más pesa para SEO en salud*
Formación IPN, Cofepris, trayectoria, filosofía, foto real. Estructura preparada para credenciales
adicionales. Es el pilar del E-E-A-T: sin ella, Google no confía en el dominio.
**Entregable:** página completa (poblar con datos reales del cliente cuando lleguen).

**Fase 7 · Antes/después + testimonios** 🚩
Construir ambas secciones detrás de feature flags apagadas (`lib/flags.ts`). Componente comparativo
con deslizador accesible (navegable por teclado).
**Entregable:** secciones completas, invisibles en producción hasta autorización legal.

**Fase 8 · Contacto**
Formulario seguro (RHF + Zod + Turnstile + honeypot) + `/api/contact` con rate limit de Upstash y
envío por Resend. Cal.com embebido. Mapa estático con enlace a Google Maps. Horarios.
**Probar el endpoint con curl**: caso feliz, honeypot, rate limit, Turnstile inválido, campos vacíos,
payload sobredimensionado, inyección de HTML.
**Entregable:** endpoint verificado contra al menos 8 casos.

**Fase 9 · Blog con Sanity**
Schemas, Studio en `/studio`, cliente y queries GROQ, listado con ISR, plantilla de artículo con
Portable Text, autor con credenciales y aviso médico. **Sembrar 5–8 artículos reciclados de los mejores
posts de Instagram**, reescritos a formato largo con intención de búsqueda (no copiar el caption tal cual:
un pie de foto de IG no es un artículo, hay que expandirlo con estructura, encabezados y respuestas reales).
**Entregable:** la doctora entra a `/studio`, publica, y lo ve en el sitio dentro de una hora.

**Fase 10 · Legal**
Página de Aviso de Privacidad, aviso médico en artículos, enlaces en el footer, revisión de claims en
todo el copy (nada de garantías de resultado).
**Entregable:** legal completo, marcado para validación del cliente.

**Fase 11 · SEO completo**
JSON-LD: `Physician` + `MedicalClinic` + `LocalBusiness` con geo de Playa del Carmen, horarios y
`medicalSpecialty`. `BlogPosting` con `author` en artículos. OG dinámico por locale. Keywords locales
en ambos idiomas.
**Entregable:** validado en el Rich Results Test de Google.

**Fase 12 · Seguridad**
CSP estática con permisos para Turnstile, Cal.com, Sanity CDN y Vercel. Headers de seguridad.
Reporter fail-open a Torre de Control. **Correr `pnpm audit` y subir a la última patch de la línea.**
**Entregable:** 0 vulnerabilidades, CSP sin romper el SSG.

**Fase 13 · QA**
E2E con Playwright (escritorio + móvil): navegación, cambio de idioma, envío del formulario, blog,
deep links de WhatsApp. Auditoría de accesibilidad. `pnpm typecheck` limpio.
**Entregable:** suite en verde. *(En Pagaza esta fase capturó un bug real de producción — no saltarla.)*

**Fase 14 · Deploy**
Proyecto en Vercel (Team Brota), variables de entorno, dominio, README de despliegue y checklist de
go-live. CI/CD: `main` → producción, PR → preview.
**Entregable:** sitio en línea, con la lista de bloqueadores legales pendientes documentada.

---

## 10. Entorno

### Prerrequisitos
- Node.js ≥ 20.11
- pnpm v11
- Cuentas de **Brota** (no personales): Vercel, Sanity, Resend, Upstash, Cloudflare Turnstile, Cal.com

### Variables de entorno

| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica | Vercel / dominio del cliente |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp en formato internacional (`52984…`) | **Pedir a la doctora** |
| `NEXT_PUBLIC_CALCOM_LINK` | Enlace público de Cal.com | cal.com (cuenta de la doctora) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del proyecto | sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | sanity.io/manage |
| `SANITY_API_READ_TOKEN` | Token de lectura | sanity.io/manage |
| `RESEND_API_KEY` | Envío de correo | resend.com |
| `CONTACT_TO_EMAIL` | Destino de las solicitudes | **Pedir a la doctora** |
| `CONTACT_FROM_EMAIL` | Remitente verificado | Requiere verificar dominio en Resend |
| `UPSTASH_REDIS_REST_URL` | Rate limiting | upstash.com |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting | upstash.com |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Anti-bot (público) | dash.cloudflare.com |
| `TURNSTILE_SECRET_KEY` | Anti-bot (secreto) | dash.cloudflare.com |
| `NEXT_PUBLIC_FEATURE_BEFORE_AFTER` | `false` hasta autorización legal | — |
| `NEXT_PUBLIC_FEATURE_TESTIMONIALS` | `false` hasta autorización legal | — |
| `TORRE_REPORTER_URL` | Torre de Control | Proyecto Torre |
| `TORRE_REPORTER_TOKEN` | Torre de Control | Proyecto Torre |

> 🔒 Los secretos se escriben **directo en Vercel o en el `.env.local`**. Nunca en el chat, nunca en
> el repo, nunca en el vault. `.env.example` lleva solo nombres, jamás valores.

---

## 11. Dependencias

### Core
| Paquete | Para qué |
|---|---|
| `next` (15.5.x) | Framework |
| `react` · `react-dom` | UI |
| `next-intl` | i18n bilingüe |
| `tailwindcss` (v4) | Estilos |
| `@radix-ui/react-accordion` · `react-dialog` | Primitivas accesibles |
| `react-hook-form` · `zod` · `@hookform/resolvers` | Formularios y validación |
| `resend` | Correo |
| `@upstash/ratelimit` · `@upstash/redis` | Rate limiting |
| `next-sanity` · `@sanity/image-url` · `sanity` | CMS del blog |
| `@calcom/embed-react` | Agenda |
| `@vercel/analytics` | Analítica |

### Dev
| Paquete | Para qué |
|---|---|
| `typescript` · `@types/*` | Tipos |
| `@playwright/test` | E2E |
| `eslint` · `eslint-config-next` | Lint |
| `prettier` · `prettier-plugin-tailwindcss` | Formato |

---

## 12. Despliegue

**Hosting:** Vercel Hobby, Team de Brota. Repo **público** en `Brota-mx/dra-patricia-garcia` — Hobby no
despliega repos privados de organización. Es seguro: los secretos viven en variables de entorno,
`work/` está gitignored, y el sitio es público de todos modos.

**CI/CD:** `main` → producción. Cada PR → preview. Verificar el preview antes de mergear.

**Dominio:** pendiente de definir con el cliente (`drapatriciagarcia.com` o similar). Verificar el
dominio en Resend (SPF/DKIM/DMARC) antes de mover `CONTACT_FROM_EMAIL` al dominio propio.

**Entornos:** Preview usa dataset de Sanity `production` en modo solo lectura y las feature flags
apagadas. Producción idéntica hasta que se autorice lo legal.

---

## 13. Estrategia de Pruebas

**Unitarias:** helpers de `lib/` — constructor de deep links de WhatsApp, esquemas Zod, helpers de SEO.

**Integración:** `/api/contact` con curl/fetch — caso feliz, honeypot, rate limit, Turnstile inválido,
campos faltantes, payload sobredimensionado, intento de inyección HTML, falta de secretos (debe dar 503).

**E2E (Playwright, escritorio + móvil):**
1. Cargan las 8 rutas en ambos idiomas sin error de consola.
2. El selector de idioma preserva la ruta equivalente.
3. El formulario valida y envía (Turnstile en modo test).
4. Los deep links de WhatsApp llevan el mensaje pre-llenado correcto por servicio.
5. El listado del blog renderiza y los artículos abren.
6. Las secciones con feature flag **no** aparecen cuando están apagadas.
7. Accesibilidad: navegación por teclado del acordeón y del menú móvil.

---

## 14. Skills para la Fase de Build

| Skill | Cuándo | Para qué |
|---|---|---|
| `/ui-ux-pro-max` | Fase 1 | Afinar paleta, pares tipográficos y estilo de componente |
| `/frontend-design` | Fases 4–6 | Cada sección de página — evitar que se sienta plantilla |
| `/seo-audit` | Post Fase 11 | Auditoría completa, énfasis en SEO local y YMYL |
| `/humanizalo` | Fases 3 y 9 | Copy y artículos que no suenen a IA |
| `/security-review` | Fase 12 | Revisión del endpoint y la CSP |
| `/accessibility-review` | Fase 13 | WCAG AA |

---

## 15. CLAUDE.md del Proyecto

```markdown
# Dra. Patricia García — Sitio del Consultorio

Sitio institucional bilingüe (ES/EN) de un consultorio de medicina general y estética en Playa del
Carmen. Cliente de Brota Mx. Marketing site con blog administrado por la doctora.

## Comandos

- `pnpm dev` — servidor de desarrollo
- `pnpm build` — build de producción (SSG)
- `pnpm lint` — linter
- `pnpm typecheck` — verificación de tipos
- `pnpm test:e2e` — Playwright
- `pnpm audit` — auditoría de seguridad (correr tras cualquier alerta)

## Stack

Next.js 15.5.x (App Router, SSG) + TypeScript strict + Tailwind v4 + next-intl v4 + Sanity (blog)
+ Resend/Upstash/Turnstile (formulario) + Cal.com (agenda) + Vercel

## Arquitectura

### Estructura
- `src/app/[locale]/` — rutas bilingües. **Solo `[locale]/layout.tsx` renderiza `<html>`** (no hay
  `app/layout.tsx` raíz — es requisito de next-intl v4)
- `src/app/api/contact/` — única ruta dinámica del sitio
- `src/components/` — `layout/`, `sections/`, `forms/`, `ui/`
- `src/content/` — contenido tipado bilingüe (servicios, consultorio, FAQ)
- `src/lib/` — clientes y helpers (sanity, resend, ratelimit, turnstile, whatsapp, seo, flags)
- `src/messages/` — cadenas de UI (`es.json`, `en.json`)
- `sanity/` — schemas del CMS
- `work/` — **GITIGNORED**, material del cliente

### Flujo de datos
Todo estático salvo dos caminos: el blog (Sanity → ISR 3600s) y el formulario
(cliente → `/api/contact` → Resend). **No hay base de datos ni datos de pacientes almacenados.**

### Patrones clave
- Server Components por defecto; `"use client"` solo en Header, ContactForm, FAQ, BookingCTA y WhatsAppFab
- Todo el contenido visible viene de `src/content/*` o de Sanity — nunca hardcodeado en un componente
- Los deep links de WhatsApp se construyen con `lib/whatsapp.ts`, nunca a mano
- Feature flags en `lib/flags.ts` controlan las secciones bloqueadas por legal

## Reglas de organización

1. Un componente por archivo. Máximo 300 líneas.
2. Alias `@/` para imports de `src/`.
3. Sin barrel exports — importar del archivo fuente.
4. Server Components por defecto.
5. Todo texto visible pasa por i18n. **Cero cadenas hardcodeadas.**

## Sistema de diseño

Ink `#14110F` · Bone `#FAF7F4` · Surface `#FFFFFF` · Malva `#9C6B8E` · Malva suave `#EFE2EA`
Muted `#6B625C` · Line `#E5DED8` · Success `#2F7A5B` · Destructive `#B3261E`

- Títulos: Jost 500–600 · Cuerpo: Inter 400 (16px, 18px en artículos)
- Radio 8px (16px tarjetas) · base de espaciado 4px · ancho máx. 1200px · texto 68ch
- Estética: editorial, respirada, móvil primero. Bordes de 1px sobre sombras pesadas.
- Malva NO alcanza contraste AA en texto pequeño — usarlo solo en ≥18px, botones e iconos.

## Variables de entorno

Ver `.env.example`. Sin `RESEND_API_KEY` / Upstash / Turnstile, `/api/contact` responde 503
(fail-closed intencional). Los secretos van directo a Vercel o `.env.local` — nunca al repo.

## Reglas No Negociables

1. **TypeScript strict. Sin `any`.** Sin `@ts-ignore` sin justificación escrita.
2. **Cero datos clínicos inventados.** Indicaciones, precios, duraciones y tiempos de recuperación
   solo si la doctora los entregó por escrito. Si falta el dato, dejar `TODO(cliente)` visible.
3. **Cero claims de garantía.** Nada de "resultados garantizados", "sin riesgos" o "permanente".
   Es riesgo regulatorio (COFEPRIS), no preferencia de copy.
4. **El formulario nunca pide información de salud.** Los datos de salud son sensibles bajo la LFPDPPP.
5. **Antes/después y testimonios permanecen tras feature flag apagada** hasta autorización explícita
   del cliente con consentimientos firmados.
6. **Los tokens de marca salen del logo real en `work/`**, no de suposiciones. Si algo de marca no
   está claro, preguntar antes de inventar.
7. **Móvil primero.** El tráfico llega del enlace de bio de Instagram.
8. **Nunca commitear `.env*` ni el contenido de `work/`.**
9. **Tras cualquier alerta de seguridad:** `pnpm audit` y subir a la última patch de la línea, no solo
   a la que sugiere el auto-fix de Vercel. Los `overrides` van en `pnpm-workspace.yaml` (pnpm v11).
10. **El merge lo autoriza Jesús.** Una rama por fase, con preview verificado.
```

---

## 16. Reglas No Negociables del Build

1. **TypeScript strict, sin `any`.** Los secretos en variables de entorno, todo en la nube.
2. **Cero datos clínicos inventados.** Un dato médico fabricado en un sitio de salud es un riesgo real.
   Falta un dato → `TODO(cliente)` visible, nunca relleno plausible.
3. **Antes/después y testimonios tras feature flag apagada** hasta que el cliente confirme
   consentimientos firmados y viabilidad regulatoria.
4. **El formulario no capta datos de salud.** Diseño deliberado para no asumir obligaciones de datos sensibles.
5. **Marca desde el asset real.** El logo en `work/` manda; el feed de Instagram aporta el acento.
   Ante duda de marca, preguntar — no inventar. *(Lección directa de Pagaza.)*
6. **Reporter fail-open a Torre de Control desde el día 1.**
7. **Una rama por fase**, con build y preview de Vercel en verde antes de pedir merge.
8. **Móvil primero**, accesibilidad AA, Lighthouse ≥95.

---

## 17. Datos que Faltan del Cliente

> Bloquean contenido, no arquitectura. Se puede construir todo dejando `TODO(cliente)`.

**🔑 Críticos (bloquean el go-live)**
- [ ] **Logo vectorial** (SVG/AI/PDF) — hoy solo hay un JPG de 29 KB
- [ ] **Número de WhatsApp** y correo de destino de las solicitudes
- [ ] **Dirección exacta del consultorio** + horarios de atención
- [ ] **Retrato profesional** de la doctora (la mayor fuga de conversión si falta — lección de Pagaza)
- [ ] **Cédula profesional** y confirmación de qué ampara el folio Cofepris `2623032002A00011`
- [ ] **Lista de servicios confirmada**, con duración y qué incluye cada uno
- [ ] Decisión sobre **precios**: ¿públicos o "cotización en consulta"?

**🟡 Importantes**
- [ ] Fotografía real del consultorio (interior y fachada)
- [ ] Consentimientos firmados de pacientes para antes/después y testimonios
- [ ] Dominio deseado + acceso al DNS
- [ ] Especialidades o diplomados adicionales para la página *Sobre mí*
- [ ] ¿La venta de dermocosmética se muestra como servicio o se omite del sitio?

**⚪ Deseables**
- [ ] Acceso al Instagram para reciclar publicaciones con sus imágenes originales
- [ ] Google Business Profile — si no existe, crearlo (pesa fuerte en SEO local)

---

## 18. Relación con el Ecosistema

**Standalone.** Repo propio, dataset de Sanity propio, proyecto de Vercel propio, sin datos compartidos
con ningún otro proyecto de Brota o Galarza. Único punto de contacto: el **reporter fail-open** hacia
la Torre de Control, que solo emite telemetría de salud del sitio.

Es un cliente de agencia sin relación de dominio con Pagaza ni Latam Abogados. Lo que **sí** se comparte
es el **patrón de arquitectura** de Pagaza (Next+i18n+formulario seguro), reusado por convención, no
por acoplamiento de código.
