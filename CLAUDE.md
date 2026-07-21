# Dra. Patricia García — Sitio del Consultorio

Sitio institucional bilingüe (ES/EN) de un consultorio de medicina general y estética en Playa del
Carmen. Cliente de **Brota Mx**. Marketing site con blog administrado por la doctora.

**El plan completo está en [`BLUEPRINT.md`](BLUEPRINT.md)** — arquitectura, orden de construcción
numerado (Fases 0–14), decisiones legales y datos pendientes del cliente. Léelo antes de construir.

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
- `src/app/[locale]/` — rutas bilingües. **Solo `[locale]/layout.tsx` renderiza `<html>`**.
  No crear `src/app/layout.tsx` — rompe next-intl v4.
- `src/app/api/contact/` — única ruta dinámica del sitio
- `src/components/` — `layout/`, `sections/`, `forms/`, `ui/`
- `src/content/` — contenido tipado bilingüe (servicios, consultorio, FAQ)
- `src/i18n/` — routing, request y navegación de next-intl
- `src/lib/` — clientes y helpers (sanity, resend, ratelimit, turnstile, whatsapp, seo, flags)
- `src/messages/` — cadenas de UI (`es.json`, `en.json`)
- `sanity/` — schemas del CMS
- `work/` — **GITIGNORED**, material del cliente

### Flujo de datos
Todo estático salvo dos caminos: el blog (Sanity → ISR 3600s) y el formulario
(cliente → `/api/contact` → Resend). **No hay base de datos ni datos de pacientes almacenados.**

### Patrones clave
- Server Components por defecto; `"use client"` solo en Header, ContactForm, FAQ, BookingCTA
  y WhatsAppFab
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
- **Malva NO alcanza contraste AA en texto pequeño** — usarlo solo en ≥18px, botones e iconos.

## Variables de entorno

Ver `.env.example`. Sin `RESEND_API_KEY` / Upstash / Turnstile, `/api/contact` debe responder 503
(fail-closed intencional). Los secretos van directo a Vercel o `.env.local` — nunca al repo.

## Reglas No Negociables

1. **TypeScript strict. Sin `any`.** Sin `@ts-ignore` sin justificación escrita.
2. **Cero datos clínicos inventados.** Indicaciones, precios, duraciones y tiempos de recuperación
   solo si la doctora los entregó por escrito. Si falta el dato, dejar `TODO(cliente)` visible.
3. **Cero claims de garantía.** Nada de "resultados garantizados", "sin riesgos" o "permanente".
   Es riesgo regulatorio (COFEPRIS), no preferencia de copy.
4. **El formulario nunca pide información de salud.** Los datos de salud son datos personales
   sensibles bajo la LFPDPPP; captarlos dispara obligaciones que no queremos asumir.
5. **Antes/después y testimonios permanecen tras feature flag apagada** hasta autorización explícita
   del cliente con consentimientos firmados.
6. **Los tokens de marca salen del logo real en `work/`**, no de suposiciones. Si algo de marca no
   está claro, preguntar antes de inventar.
7. **Móvil primero.** El tráfico llega del enlace de bio de Instagram.
8. **Nunca commitear `.env*` ni el contenido de `work/`.**
9. **Tras cualquier alerta de seguridad:** `pnpm audit` y subir a la última patch de la línea, no
   solo a la que sugiere el auto-fix de Vercel. Los overrides van en `pnpm.overrides` de
   `package.json` (pnpm 10).
10. **El merge lo autoriza Jesús.** Una rama por fase, con preview de Vercel verificado.
