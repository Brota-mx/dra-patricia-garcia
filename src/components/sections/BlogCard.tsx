import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { urlForImage } from "@/lib/sanity";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { PostSummary } from "@/types/blog";

export async function BlogCard({
  post,
  locale,
}: {
  post: PostSummary;
  locale: Locale;
}) {
  const t = await getTranslations("blogPage");
  const href = getPathname({
    href: { pathname: "/blog/[slug]", params: { slug: post.slug } },
    locale,
  });
  const cover = urlForImage(post.coverImage)?.width(640).height(400).url();
  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <Card as="article" className="flex flex-col overflow-hidden !p-0">
      {cover && (
        <a href={href} className="block aspect-[16/10] overflow-hidden bg-line">
          <Image
            src={cover}
            alt={post.coverImage?.alt ?? ""}
            width={640}
            height={400}
            className="h-full w-full object-cover"
          />
        </a>
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.category && <Badge tone="accent">{post.category.title}</Badge>}
        <h2 className="mt-3 text-title">
          <a href={href} className="hover:text-malva-deep">
            {post.title}
          </a>
        </h2>
        <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt}</p>
        <p className="mt-4 text-sm text-muted">
          {post.authorName} · <time dateTime={post.publishedAt}>{date}</time>
        </p>
        <a
          href={href}
          className="mt-4 text-sm font-medium text-malva-deep hover:underline"
        >
          {t("readArticle")}
        </a>
      </div>
    </Card>
  );
}
