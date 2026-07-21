import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El Studio de Sanity y la referencia interna de diseño no son
      // contenido público.
      disallow: ["/studio", "/es/design-system", "/en/design-system"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
