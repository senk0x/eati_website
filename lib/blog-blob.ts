/**
 * Vercel Blob persistence for blog articles.
 *
 * Reads and writes article JSON to Vercel Blob when BLOB_READ_WRITE_TOKEN is
 * present (production). Falls back to local filesystem helpers when it is not.
 *
 * Setup: Vercel Dashboard → Storage → Connect Store → Blob.
 * Vercel adds BLOB_READ_WRITE_TOKEN automatically.
 */

import { getArticleBySlug, getPublishedArticles, getRelatedArticles, saveArticle, deleteArticle, BlogArticle } from './blog';

const BLOB_PREFIX = 'articles/';

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// ── Write ────────────────────────────────────────────────────────────────────

export async function persistArticle(article: BlogArticle): Promise<void> {
  if (blobConfigured()) {
    const { put } = await import('@vercel/blob');
    await put(
      `${BLOB_PREFIX}${article.slug}.json`,
      JSON.stringify(article, null, 2),
      { access: 'public', contentType: 'application/json', addRandomSuffix: false },
    );
  } else {
    saveArticle(article);
  }
}

export async function removeArticle(slug: string): Promise<void> {
  if (blobConfigured()) {
    const { del, list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.json` });
    if (blobs.length) await del(blobs.map((b) => b.url));
  } else {
    deleteArticle(slug);
  }
}

// ── Read (hybrid: Blob overrides filesystem) ──────────────────────────────────

async function fetchBlobArticle(slug: string): Promise<BlogArticle | null> {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.json` });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as BlogArticle;
  } catch {
    return null;
  }
}

async function fetchAllBlobArticles(): Promise<BlogArticle[]> {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    const jsonBlobs = blobs.filter((b) => b.url.endsWith('.json') || b.pathname?.endsWith('.json'));
    const articles = await Promise.all(
      jsonBlobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: 'no-store' });
          return res.ok ? ((await res.json()) as BlogArticle) : null;
        } catch {
          return null;
        }
      }),
    );
    return articles.filter(Boolean) as BlogArticle[];
  } catch {
    return [];
  }
}

/** Read single article: Blob overrides filesystem so admin edits are instant. */
export async function getArticleHybrid(slug: string): Promise<BlogArticle | null> {
  if (blobConfigured()) {
    const blobArticle = await fetchBlobArticle(slug);
    if (blobArticle) return blobArticle;
  }
  return getArticleBySlug(slug);
}

/** Read all published articles: Blob versions override filesystem versions. */
export async function getPublishedArticlesHybrid(): Promise<BlogArticle[]> {
  const fsArticles = getPublishedArticles();

  if (!blobConfigured()) return fsArticles;

  const blobArticles = await fetchAllBlobArticles();

  // Merge: Blob overrides filesystem for same slug
  const merged = new Map<string, BlogArticle>();
  for (const a of fsArticles) merged.set(a.slug, a);
  for (const a of blobArticles) merged.set(a.slug, a);

  return Array.from(merged.values())
    .filter((a) => a.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/** Related articles using hybrid read. */
export async function getRelatedArticlesHybrid(
  currentSlug: string,
  limit = 3,
): Promise<BlogArticle[]> {
  const current = await getArticleHybrid(currentSlug);
  if (!current) return [];

  const all = await getPublishedArticlesHybrid();
  const others = all.filter((a) => a.slug !== currentSlug);

  if (current.relatedSlugs?.length) {
    const related = current.relatedSlugs
      .map((s) => others.find((a) => a.slug === s))
      .filter(Boolean) as BlogArticle[];
    if (related.length >= limit) return related.slice(0, limit);
    const rest = others.filter((a) => !current.relatedSlugs!.includes(a.slug));
    return [...related, ...rest].slice(0, limit);
  }

  return others.slice(0, limit);
}
