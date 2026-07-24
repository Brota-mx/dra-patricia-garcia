import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { Prose } from "@/components/ui/Prose";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getPostBySlug, getPostSlugs, urlForImage } from "@/lib/sanity";
import { getPathname } from "@/i18n/navigation";
import { buildAlternates, siteUrl } from "@/lib/seo";
import { seoKeywords } from "@/content/seoKeywords";
import { routing, type Locale } from "@/i18n/routing";
import type { BlogImage } from "@/types/blog";

export const revalidate = 3600;

export async function generateStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) => {
      const slugs = await getPostSlugs(locale);
      return slugs.map((slug) => ({ locale, slug }));
    }),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};

  // Portada real si ya se subió desde /studio; si no, se hereda el OG por
  // defecto del locale (opengraph-image.tsx) — nunca una imagen inventada.
  const cover = urlForImage(post.coverImage)?.width(1200).height(630).url();

  return {
    title: post.title,
    description: post.excerpt,
    alternates: buildAlternates("/blog", locale),
    // El artículo trae sus propias keywords desde Sanity (opcional); si no
    // las tiene, cae al set estático del blog en general.
    keywords:
      post.seoKeywords && post.seoKeywords.length > 0
        ? post.seoKeywords
        : seoKeywords.blog[locale],
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      title: post.title,
      description: post.excerpt,
      ...(cover && { images: [{ url: cover, width: 1200, height: 630 }] }),
    },
  };
}

// Título/citas ya llevan su propio tratamiento tipográfico en Prose; sólo
// personalizamos lo que Portable Text no puede resolver solo: imágenes
// (necesitan el builder de Sanity) y enlaces externos (necesitan rel/target).
function portableTextComponents(): PortableTextComponents {
  return {
    types: {
      image: ({ value }: { value: BlogImage & { alt?: string } }) => {
        const url = urlForImage(value)?.width(1200).fit("max").url();
        if (!url) return null;
        return (
          <Image
            src={url}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            className="my-8 rounded-card"
          />
        );
      },
    },
    marks: {
      link: ({
        value,
        children,
      }: {
        value?: { href?: string };
        children: ReactNode;
      }) => {
        const href = value?.href ?? "#";
        const isExternal = /^https?:\/\//.test(href) && !href.startsWith(siteUrl());
        return (
          <a
            href={href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {children}
          </a>
        );
      },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const t = await getTranslations("blogPage");
  const blogHref = getPathname({ href: "/blog", locale });
  const cover = urlForImage(post.coverImage)?.width(1600).height(900).url();
  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  // JSON-LD: el mismo principio de E-E-A_T que /sobre-mi — un artículo de
  // salud sin autor atribuible y verificable pesa negativo en Google (YMYL).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    inLanguage: locale,
    ...(post.seoKeywords && post.seoKeywords.length > 0 && {
      keywords: post.seoKeywords.join(", "),
    }),
    ...(cover && { image: cover }),
    author: {
      "@type": "Person",
      name: post.author.name,
      // Sólo describe formación, no inventa un cargo — mismo texto que ya se
      // muestra en la tarjeta de autor debajo del artículo.
      jobTitle: post.author.credentials,
    },
    publisher: { "@type": "MedicalBusiness", name: "Dra. Patricia García" },
    mainEntityOfPage: `${siteUrl()}${getPathname({ href: { pathname: "/blog/[slug]", params: { slug } }, locale })}`,
    url: `${siteUrl()}${getPathname({ href: { pathname: "/blog/[slug]", params: { slug } }, locale })}`,
  };

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Button variant="ghost" size="sm" href={blogHref}>
        {t("backToBlog")}
      </Button>

      <div className="mt-8 max-w-[68ch]">
        {post.category && <Badge tone="accent">{post.category.title}</Badge>}
        <h1 className="mt-4 text-display">{post.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {post.author.name} · <time dateTime={post.publishedAt}>{date}</time>
        </p>
      </div>

      {cover && (
        <Image
          src={cover}
          alt={post.coverImage?.alt ?? ""}
          width={1600}
          height={900}
          priority
          className="mt-10 w-full rounded-card object-cover"
        />
      )}

      <Prose className="mt-10">
        <PortableText value={post.body} components={portableTextComponents()} />
      </Prose>

      {post.medicalDisclaimer && (
        <p className="mt-12 max-w-[68ch] border-t border-line pt-6 text-sm text-muted">
          {t("medicalDisclaimer")}
        </p>
      )}

      <div className="mt-12 flex items-start gap-4 rounded-card border border-line bg-surface p-6">
        {post.author.photo && urlForImage(post.author.photo) && (
          <Image
            src={urlForImage(post.author.photo)!.width(96).height(96).url()}
            alt={post.author.photo.alt}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-display font-medium">{post.author.name}</p>
          <p className="mt-1 text-sm text-malva-deep">{post.author.credentials}</p>
          {post.author.bio && (
            <p className="mt-2 text-sm text-muted">{post.author.bio}</p>
          )}
        </div>
      </div>
    </main>
  );
}
