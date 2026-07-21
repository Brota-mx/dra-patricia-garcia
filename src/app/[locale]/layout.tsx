import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Jost, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { siteUrl } from "@/lib/seo";
import "../globals.css";

// next/font descarga y auto-hospeda las fuentes en build: cero peticiones a
// Google en runtime y sin parpadeo de fuente.
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    // Las páginas hijas heredan la plantilla: "Servicios | Dra. Patricia García"
    title: { default: t("title"), template: `%s | Dra. Patricia García` },
    description: t("description"),
    metadataBase: new URL(siteUrl()),
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "es" ? "es_MX" : "en_US",
      type: "website",
      siteName: "Dra. Patricia García",
    },
  };
}

// ÚNICO layout que renderiza <html> — requisito de next-intl v4.
// NO crear src/app/layout.tsx.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <html lang={locale} className={`${jost.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-surface"
          >
            {t("skipToContent")}
          </a>
          <Header />
          <div id="contenido" className="flex-1">
            {children}
          </div>
          <Footer />
          <WhatsAppFab />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
