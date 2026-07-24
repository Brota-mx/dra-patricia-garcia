import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// CSP estática (Fase 12). Sin nonce por request: el sitio es SSG y la política
// se declara una vez en build, no por middleware. `script-src`/`style-src`
// necesitan 'unsafe-inline' porque Next.js App Router inyecta scripts inline
// para hidratar el streaming de RSC incluso en páginas estáticas — sin nonce
// dinámico no hay forma de evitarlo sin romper la hidratación.
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://app.cal.com https://cal.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://app.cal.com https://cal.com https://*.sanity.io",
  "frame-src https://challenges.cloudflare.com https://app.cal.com https://cal.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
  "report-uri /api/csp-report",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Sanity CDN para las imágenes del blog.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    return [
      {
        // Sanity Studio (/studio) queda fuera: su bundle (Vite/React) necesita
        // 'unsafe-eval' y hosts adicionales de api.sanity.io, y ya está
        // protegido por el login propio de Sanity, no por esta CSP.
        source: "/((?!studio).*)",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
        ],
      },
      {
        source: "/studio/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
