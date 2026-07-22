import type { PortableTextBlock } from "@portabletext/types";

export type BlogImage = {
  asset: { _ref: string; _id?: string };
  hotspot?: { x: number; y: number };
};

export type PostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  // `null` mientras falte subir el asset real en /studio — ver
  // scripts/seed-sanity.mjs. La UI debe omitir la portada, nunca inventarla.
  coverImage: (BlogImage & { alt: string }) | null;
  category: { title: string; slug: string } | null;
  authorName: string;
  publishedAt: string;
};

export type PostDetail = PostSummary & {
  body: PortableTextBlock[];
  medicalDisclaimer: boolean;
  author: {
    name: string;
    credentials: string;
    photo: (BlogImage & { alt: string }) | null;
    bio: string | null;
  };
};
