import { createClient, type SanityClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { Locale } from "@/i18n/routing";
import type { PostSummary, PostDetail, BlogImage } from "@/types/blog";

/**
 * Variables requeridas para hablar con Sanity. Ausentes hasta que Jesús cree
 * la cuenta de Brota y las cargue (ver Estado - Patricia Garcia.md) — el blog
 * debe degradarse con dignidad mientras tanto, no tronar el build ni el SSR.
 * Mismo patrón que `contactEmailEnv()` en lib/resend.ts.
 */
export function sanityEnv() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;
  return { projectId, dataset };
}

let client: SanityClient | null | undefined;

/** `null` si Sanity no está configurado — todo lector debe manejar ese caso. */
export function getSanityClient(): SanityClient | null {
  if (client !== undefined) return client;

  const env = sanityEnv();
  if (!env) {
    client = null;
    return null;
  }

  client = createClient({
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: "2026-07-01",
    useCdn: true,
    // Token de LECTURA. Solo hace falta si el dataset no es público
    // (recomendado para contenido de salud, aunque no sea clínico).
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: "published",
  });
  return client;
}

/**
 * `null` si Sanity no está configurado, o si el artículo todavía no tiene el
 * asset real (queda pendiente de subirse en /studio — ver seed-sanity.mjs).
 * El componente que llama debe omitir la imagen en ese caso, no inventar una.
 */
export function urlForImage(image: BlogImage | null | undefined) {
  if (!image?.asset) return null;
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;
  return imageUrlBuilder(sanityClient).image(image);
}

const postSummaryFields = /* groq */ `
  "_id": _id,
  "title": title[$locale],
  "slug": slug[$locale].current,
  "excerpt": excerpt[$locale],
  coverImage {
    asset,
    hotspot,
    "alt": alt[$locale]
  },
  "category": category->{ "title": title[$locale], "slug": slug.current },
  "authorName": author->name,
  publishedAt
`;

const postDetailFields = /* groq */ `
  ${postSummaryFields},
  "body": body[$locale],
  medicalDisclaimer,
  author-> {
    name,
    "credentials": credentials[$locale],
    photo { asset, hotspot, "alt": alt },
    "bio": bio[$locale]
  }
`;

/**
 * Listado publicado, ordenado por fecha. `slug != null` filtra artículos que
 * todavía no tienen traducción completa en este idioma — mismo principio que
 * `isPublishable()` en types/content.ts: paridad de idioma antes de exponer.
 */
export async function getPosts(locale: Locale): Promise<PostSummary[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];

  return sanityClient.fetch(
    /* groq */ `*[_type == "post" && defined(slug[$locale].current)] | order(publishedAt desc) { ${postSummaryFields} }`,
    { locale },
    { next: { revalidate: 3600 } },
  );
}

export async function getPostSlugs(locale: Locale): Promise<string[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];

  return sanityClient.fetch(
    /* groq */ `*[_type == "post" && defined(slug[$locale].current)][].slug[$locale].current`,
    { locale },
    { next: { revalidate: 3600 } },
  );
}

export async function getPostBySlug(
  slug: string,
  locale: Locale,
): Promise<PostDetail | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;

  const post = await sanityClient.fetch(
    /* groq */ `*[_type == "post" && slug[$locale].current == $slug][0] { ${postDetailFields} }`,
    { slug, locale },
    { next: { revalidate: 3600 } },
  );

  return post ?? null;
}
