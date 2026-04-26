import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/blog";
import { encodeImageForOgDataUrl } from "@/lib/og/encodeImageForOg";
import { notFound } from "next/navigation";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/** Node: blog articles are read from disk via `getArticleBySlug`. */
export const runtime = "nodejs";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await Promise.resolve(params);
  const article = getArticleBySlug(slug);
  const alt =
    article && article.published
      ? `${article.title} — featured Open Graph image for this Eati blog article on nutrition, calories, and healthy weight loss`
      : "Eati nutrition and weight loss blog — Open Graph preview image";
  return [
    {
      id: "default",
      alt,
      size,
      contentType: "image/png" as const,
    },
  ];
}

function truncateTitle(title: string, max = 72): string {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1)}…`;
}

function blogOgMarkup(
  title: string,
  coverDataUrl: string | null,
  w: number,
  h: number
) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        position: "relative",
        background: "#1a2744",
      }}
    >
      {[
        ...(coverDataUrl
          ? [
              <img
                key="cover"
                src={coverDataUrl}
                alt=""
                width={w}
                height={h}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />,
            ]
          : []),
        <div
          key="grad"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background: coverDataUrl
              ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, transparent 72%)"
              : "linear-gradient(145deg, #85BEFF 0%, #2F5176 100%)",
          }}
        />,
        <div
          key="text"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 48,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {[
            <div
              key="t"
              style={{
                display: "flex",
                fontSize: 52,
                fontWeight: 800,
                color: "white",
                lineHeight: 1.15,
                textShadow: "0 2px 24px rgba(0,0,0,0.45)",
              }}
            >
              {title}
            </div>,
            <div
              key="b"
              style={{
                display: "flex",
                fontSize: 24,
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
              }}
            >
              {`Eati Blog · ${SITE_URL.replace(/^https?:\/\//, "")}`}
            </div>,
          ]}
        </div>,
      ]}
    </div>
  );
}

export default async function BlogOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  const title = truncateTitle(article.title);
  const coverUrl = article.coverImage
    ? article.coverImage.startsWith("http")
      ? article.coverImage
      : absoluteUrl(article.coverImage)
    : null;

  const coverDataUrl =
    coverUrl != null ? await encodeImageForOgDataUrl(coverUrl) : null;

  const w = size.width;
  const h = size.height;

  try {
    return new ImageResponse(blogOgMarkup(title, coverDataUrl, w, h), {
      ...size,
    });
  } catch {
    return new ImageResponse(blogOgMarkup(title, null, w, h), { ...size });
  }
}
