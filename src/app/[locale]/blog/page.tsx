import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPosts } from "@/lib/sanity";
import { BlogCard } from "@/components/sections/BlogCard";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog" });
  const posts = await getPosts(locale);

  return {
    title: t("title"),
    alternates: buildAlternates("/blog", locale),
    // Una página de listado sin artículos no debe indexarse — un sitio de
    // salud (YMYL) no gana confianza mostrando una sección vacía a Google.
    // Se quita el noindex solo cuando hay al menos un artículo real.
    robots: { index: posts.length > 0, follow: true },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blogPage");
  const posts = await getPosts(locale);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <p className="eyebrow text-malva-deep">{t("eyebrow")}</p>
      <h1 className="mt-4 max-w-[20ch] text-display">{t("title")}</h1>
      <p className="mt-4 max-w-[68ch] text-body-lg text-muted">{t("lead")}</p>

      {posts.length === 0 ? (
        <p className="mt-16 text-sm text-muted">{t("empty")}</p>
      ) : (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} locale={locale} />
          ))}
        </div>
      )}
    </main>
  );
}
